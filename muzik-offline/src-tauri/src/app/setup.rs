use crate::components::audio_manager::AppAudioManager;
use crate::components::kira_audio_manager::KiraManager;
use crate::components::rodio_audio_manager::RodioManager;
use crate::database::db_api::{get_image_from_tree, get_null_cover_from_tree, get_thumbnail, get_wallpaper};
use crate::database::db_manager::DbManager;
use kira::manager::{backend::DefaultBackend, AudioManager, AudioManagerSettings};
use crate::music::media_control_api::configure_media_controls;
use souvlaki::{MediaControlEvent, MediaControls};
use warp::{http::Uri, reply::Response, Filter, Reply};

use std::sync::{Arc, Mutex};
use tauri::async_runtime::{self, spawn};
use tauri::Manager;
use tokio::sync::mpsc;

use crate::music::media_control_api::{config_mca, event_handler};
use crate::utils::general_utils::get_random_port;

use super::setup_macos;

/// Initializes the kira audio manager with required settings.
pub fn initialise_kira_audio_manager() -> Arc<Mutex<Option<KiraManager>>> {
    match AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()){
        Ok(audio_manager) => {
            Arc::new(Mutex::new(Some(KiraManager {
                manager: audio_manager,
                instance_handle: None,
                volume: 0.0,
                crossfade: false,
                duration: None,
            })))
        }
        Err(_) => {
            Arc::new(Mutex::new(None))
        }
    }
}

/// Initializes the Rodio audio manager with required settings.
pub fn initialise_rodio_audio_manager() -> Arc<Mutex<RodioManager>> {
    Arc::new(Mutex::new(RodioManager::new()))
}

/// Initializes the AppAudioManager with required settings.
pub fn initialize_audio_manager() -> Arc<Mutex<AppAudioManager>> {
    // Create a Rodio device and get the output stream handle
    Arc::new(Mutex::new(AppAudioManager {
        controls: None,
        cover_url: String::new(),
        port: 0,
    }))
}

/// Sets up the Tauri application.
pub fn setup_app(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let (tx, mut rx): (
        mpsc::Sender<MediaControlEvent>,
        mpsc::Receiver<MediaControlEvent>,
    ) = mpsc::channel(32);
    setup_macos::setup_macos(app)?;
    let shared_audio_manager = Arc::clone(&app.state::<Arc<Mutex<AppAudioManager>>>());
    let shared_db_manager = Arc::clone(&app.state::<Arc<Mutex<DbManager>>>());

    // setup audio manager

    // Set up the image route
    let cover_image_route = create_image_route_for_covers(shared_db_manager.clone());
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
        .cover_url = format!("http://localhost:{}/covers/NULL_COVER_NULL", port);

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
    let window = app.handle().clone();
    spawn(async move {
        while let Some(event) = rx.recv().await {
            event_handler(&window, &event);
        }
    });

    Ok(())
}

/// Creates the image route for serving the cover image.
pub fn create_image_route_for_covers(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("covers" / String)
        .and(warp::get())
        .map(move |uuid: String| {
            match shared_db_manager.lock() {
                Ok(db_manager) => {
                    if uuid.starts_with("NULL"){
                        warp::reply::with_header(
                            get_null_cover_from_tree(db_manager, uuid.as_str()),
                            "Content-Type",
                            "image/png",
                        )
                        .into_response()
                    } else{
                        warp::reply::with_header(
                            get_image_from_tree(db_manager, uuid.as_str()),
                            "Content-Type",
                            "image/png",
                        )
                        .into_response()
                    }
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
pub fn create_image_route_with_uuid(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("image" / String)
        .and(warp::get())
        .map(move |uuid: String| {
            match shared_db_manager.lock() {
                Ok(db_manager) => {
                    if uuid.starts_with("NULL"){
                        warp::reply::with_header(
                            get_null_cover_from_tree(db_manager, uuid.as_str()),
                            "Content-Type",
                            "image/png",
                        )
                        .into_response()
                    } else{
                        warp::reply::with_header(
                            get_image_from_tree(db_manager, uuid.as_str()),
                            "Content-Type",
                            "image/png",
                        )
                        .into_response()
                    }
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
pub fn create_thumbnail_route_with_uuid(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("thumbnail" / String)
        .and(warp::get())
        .map(move |uuid: String| {
            match shared_db_manager.lock() {
                Ok(db_manager) => warp::reply::with_header(
                    get_thumbnail(db_manager, uuid.as_str()),
                    "Content-Type",
                    "image/png",
                )
                .into_response(),
                Err(_) => {
                    // Redirect to default image on Imgur
                    warp::redirect::temporary(Uri::from_static("https://i.imgur.com/1bJ0j6V.png"))
                        .into_response()
                }
            }
        })
}

/// Creates the wallpaper route for serving the :uuid wallpaper image.
pub fn create_wallpaper_route_with_uuid(
    shared_db_manager: Arc<Mutex<DbManager>>,
) -> impl Filter<Extract = (Response,), Error = warp::Rejection> + Clone {
    warp::path!("wallpaper" / String)
        .and(warp::get())
        .map(move |uuid: String| {
            match shared_db_manager.lock() {
                Ok(db_manager) => warp::reply::with_header(
                    get_wallpaper(db_manager, uuid.as_str()),
                    "Content-Type",
                    "image/png",
                )
                .into_response(),
                Err(_) => {
                    // Redirect to default image on Imgur
                    warp::redirect::temporary(Uri::from_static("https://i.imgur.com/1bJ0j6V.png"))
                        .into_response()
                }
            }
        })
}

/// Sets up the media controls for the application.
pub fn setup_media_controls(
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
        &format!("http://localhost:{}/covers/NULL_COVER_NULL", port).to_owned(),
    );
}