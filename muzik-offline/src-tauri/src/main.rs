// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app;
mod commands;
mod components;
mod constants;
mod database;
mod music;
mod socials;
mod utils;

use commands::general_commands::get_server_port;
use commands::refresh_paths_at_start::{detect_deleted_songs, refresh_paths};
use components::audio_manager::BackendStateManager;
use constants::null_cover_null::NULL_COVER_NULL;
use database::db_api::{add_new_wallpaper_to_db, create_playlist_cover, delete_playlist_cover, delete_thumbnail_and_wallpaper,
    get_albums_not_in_vec, get_artists_not_in_vec, get_genres_not_in_vec, get_image_from_tree, get_songs_not_in_vec, get_thumbnail, get_wallpaper};
use database::db_manager::DbManager;
use kira::manager::{backend::DefaultBackend, AudioManager, AudioManagerSettings};
use music::media_control_api::configure_media_controls;
use socials::discord_rpc::{set_discord_rpc_activity_with_timestamps, DiscordRpc};
use souvlaki::{MediaControlEvent, MediaControls};
use utils::general_utils::decode_image_in_parallel;
use utils::music_list_organizer::MLO;
use warp::{http::Uri, reply::Response, Filter, Reply};

use std::sync::{Arc, Mutex};
use tauri::async_runtime::{self, spawn};
use tauri::{AppHandle, Emitter, Manager};
use tokio::sync::mpsc;

use crate::app::controller::{drag_app_window, toggle_app_pin, toggle_miniplayer_view, turn_on_translucency, turn_off_translucency};
use crate::commands::{metadata_edit::edit_song_metadata, metadata_retriever::get_all_songs};

use crate::commands::general_commands::{
    get_audio_dir, open_in_file_manager, resize_frontend_image_to_fixed_height,
};
use crate::database::db_api::{
    get_all_albums, get_all_artists, get_all_genres, get_all_songs_in_db,
};
use crate::music::media_control_api::{
    config_mca, event_handler, set_player_state, update_metadata,
};
use crate::music::player::{
    get_song_position, load_a_song_from_path, load_and_play_song_from_path, pause_song,
    resume_playing, seek_by, seek_to, set_volume, stop_song,
};
use crate::socials::discord_rpc::{
    allow_connection_and_connect_to_discord_rpc, attempt_to_connect_if_possible,
    clear_discord_rpc_activity, disallow_connection_and_close_discord_rpc,
    set_discord_rpc_activity,
};
use crate::utils::general_utils::get_random_port;
use crate::utils::music_list_organizer::{
    mlo_get_next_batch_as_size, mlo_reset_and_set_remaining_keys, mlo_set_repeat_list,
    mlo_set_shuffle_list,
};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .manage(initialize_audio_manager())
        .manage(Arc::new(Mutex::new(DbManager::new().expect("failed to initialize db manager"))))
        .manage(Mutex::new(MLO::new()))
        .manage(Mutex::new(DiscordRpc::new().expect("failed to initialize discord rpc")))
        .setup(setup_app)
        .invoke_handler(tauri::generate_handler![
            // WINDOW CONTROL
            toggle_app_pin,
            toggle_miniplayer_view,
            drag_app_window,
            turn_on_translucency,
            turn_off_translucency,
            update_metadata,
            set_player_state,
            // GENERAL COMMANDS
            get_all_songs,
            open_in_file_manager,
            set_volume,
            get_audio_dir,
            edit_song_metadata,
            get_server_port,
            refresh_paths,
            detect_deleted_songs,
            // MUSIC PLAYER
            load_and_play_song_from_path,
            load_a_song_from_path,
            pause_song,
            resume_playing,
            stop_song,
            seek_to,
            seek_by,
            get_song_position,
            // UTILS
            resize_frontend_image_to_fixed_height,
            // MUSIC LIST ORGANIZER
            mlo_set_shuffle_list,
            mlo_set_repeat_list,
            mlo_reset_and_set_remaining_keys,
            mlo_get_next_batch_as_size,
            // DATABASE API
            get_all_songs_in_db,
            get_songs_not_in_vec,
            get_all_albums,
            get_albums_not_in_vec,
            get_all_artists,
            get_artists_not_in_vec,
            get_all_genres,
            get_genres_not_in_vec,
            add_new_wallpaper_to_db,
            create_playlist_cover,
            delete_playlist_cover,
            delete_thumbnail_and_wallpaper,
            // DISCORD RPC
            allow_connection_and_connect_to_discord_rpc,
            attempt_to_connect_if_possible,
            disallow_connection_and_close_discord_rpc,
            set_discord_rpc_activity,
            set_discord_rpc_activity_with_timestamps,
            clear_discord_rpc_activity
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Initializes the BackendStateManager with required settings.
fn initialize_audio_manager() -> Arc<Mutex<BackendStateManager>> {
    let audio_manager = AudioManager::<DefaultBackend>::new(AudioManagerSettings::default())
        .expect("failed to initialize audio manager");

    Arc::new(Mutex::new(BackendStateManager {
        manager: audio_manager,
        instance_handle: None,
        volume: 0.0,
        controls: None,
        cover: decode_image_in_parallel(&NULL_COVER_NULL.to_owned())
            .expect("failed to decode image"),
        cover_url: String::new(),
        port: 0,
    }))
}

/// Sets up the Tauri application.
fn setup_app(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let (tx, mut rx): (
        mpsc::Sender<MediaControlEvent>,
        mpsc::Receiver<MediaControlEvent>,
    ) = mpsc::channel(32);
    let shared_audio_manager = Arc::clone(&app.state::<Arc<Mutex<BackendStateManager>>>());
    let shared_db_manager = Arc::clone(&app.state::<Arc<Mutex<DbManager>>>());
    let window = app.handle().clone();

    // Set up the image route
    let cover_image_route = create_image_route(shared_audio_manager.clone());
    let image_route_with_uuid = create_image_route_with_uuid(shared_db_manager.clone());
    let thumbnail_route_with_uuid = create_thumbnail_route_with_uuid(shared_db_manager.clone());
    let wallpaper_route_with_uuid = create_wallpaper_route_with_uuid(shared_db_manager.clone());
    let routes = cover_image_route
                                                                .or(image_route_with_uuid)
                                                                .or(thumbnail_route_with_uuid)
                                                                .or(wallpaper_route_with_uuid);

    // get random port for warp server
    let port = get_random_port();

    // Start the warp server and serve both routes
    spawn(async move {
        warp::serve(routes).run(([127, 0, 0, 1], port)).await;
    });

    // add url to shared audio manager
    shared_audio_manager
        .lock()
        .expect("failed to lock shared audio manager")
        .cover_url = format!("http://localhost:{}/cover", port);

    // Set up media controls
    let mut controls = config_mca().expect("Failed to initialize media controls");
    setup_media_controls(&mut controls, tx.clone(), port);

    // Set port in shared audio manager
    shared_audio_manager
        .lock()
        .expect("failed to lock shared audio manager")
        .port = port;

    // Store the controls in the shared audio manager
    shared_audio_manager
        .lock()
        .expect("failed to lock shared audio manager")
        .controls = Some(controls);

    // Handle media control events
    spawn(async move {
        while let Some(event) = rx.recv().await {
            event_handler(&window, &event);
        }
    });

    // Collect args from the command line
    collect_args(app.handle());
    Ok(())
}

/// Creates the image route for serving the cover image.
fn create_image_route(
    shared_audio_manager: Arc<Mutex<BackendStateManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path("cover").and(warp::get()).map(move || {
        match shared_audio_manager.lock() {
            Ok(audio_manager) => {
                warp::reply::with_header(audio_manager.cover.clone(), "Content-Type", "image/png")
                    .into_response()
            }
            Err(_) => {
                // Redirect to default image on Imgur
                warp::redirect::temporary(Uri::from_static("https://i.imgur.com/1bJ0j6V.png"))
                    .into_response()
            }
        }
    })
}

/// Creates the image route for serving the :uuid cover image.
fn create_image_route_with_uuid(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("image" / String).and(warp::get()).map(move |uuid: String| {
        match shared_db_manager.lock() {
            Ok(db_manager) => {
                warp::reply::with_header(get_image_from_tree(db_manager, uuid.as_str()), "Content-Type", "image/png")
                    .into_response()
            }
            Err(_) => {
                // Redirect to default image on Imgur
                warp::redirect::temporary(Uri::from_static("https://i.imgur.com/1bJ0j6V.png"))
                    .into_response()
            }
        }
    })
}

/// Creates the thumbnail route for serving the :uuid thumbnail image.
fn create_thumbnail_route_with_uuid(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("thumbnail" / String).and(warp::get()).map(move |uuid: String| {
        match shared_db_manager.lock() {
            Ok(db_manager) => {
                warp::reply::with_header(get_thumbnail(db_manager, uuid.as_str()), "Content-Type", "image/png")
                    .into_response()
            }
            Err(_) => {
                // Redirect to default image on Imgur
                warp::redirect::temporary(Uri::from_static("https://i.imgur.com/1bJ0j6V.png"))
                    .into_response()
            }
        }
    })
}

/// Creates the wallpaper route for serving the :uuid wallpaper image.
fn create_wallpaper_route_with_uuid(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("wallpaper" / String).and(warp::get()).map(move |uuid: String| {
        match shared_db_manager.lock() {
            Ok(db_manager) => {
                warp::reply::with_header(get_wallpaper(db_manager, uuid.as_str()), "Content-Type", "image/png")
                    .into_response()
            }
            Err(_) => {
                // Redirect to default image on Imgur
                warp::redirect::temporary(Uri::from_static("https://i.imgur.com/1bJ0j6V.png"))
                    .into_response()
            }
        }
    })
}

/// Sets up the media controls for the application.
fn setup_media_controls(
    controls: &mut MediaControls,
    tx: mpsc::Sender<MediaControlEvent>,
    port: u16,
) {
    controls
        .attach(move |event: MediaControlEvent| {
            let tx = tx.clone();
            async_runtime::spawn(async move {
                if tx.send(event).await.is_err() {
                    println!("Failed to send event");
                }
            });
        })
        .expect("Failed to attach media controls");

    configure_media_controls(
        controls,
        &format!("http://localhost:{}/cover", port).to_owned(),
    );
}

/// Collect args from the command line and return them as a vector of strings.
fn collect_args(app: &AppHandle) {
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        let audio_file_path = &args[1];
        app.emit("loadSong", audio_file_path).expect("failed to emit loadSong");
    }
}