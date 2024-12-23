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
mod windows;
mod export;
mod import;

use commands::general_commands::{collect_env_args, get_server_port};
use commands::refresh_paths_at_start::{detect_deleted_songs, refresh_paths};
use database::db_api::{
    add_new_wallpaper_to_db, create_playlist_cover, delete_playlist_cover,
    delete_thumbnail_and_wallpaper, get_albums_not_in_vec, get_artists_not_in_vec,
    get_genres_not_in_vec, get_songs_not_in_vec
};
use database::db_manager::DbManager;
use export::{export_csv::export_songs_as_csv, export_html::export_songs_as_html, 
    export_json::export_songs_as_json,export_txt::export_songs_as_txt, export_xml::export_songs_as_xml};
use music::player::{get_available_audio_backends, set_playback_speed};
//use export::export_pdf::export_songs_as_pdf;
use socials::discord_rpc::{set_discord_rpc_activity_with_timestamps, DiscordRpc};
use utils::music_list_organizer::MLO;

use std::sync::{Arc, Mutex};

use crate::windows::controller::{drag_app_window, toggle_app_pin, toggle_miniplayer_view};
use crate::commands::{metadata_edit::edit_song_metadata, metadata_retriever::get_all_songs};

use crate::commands::general_commands::{
    get_audio_dir, open_in_file_manager, resize_frontend_image_to_fixed_height, delete_song_metadata,
};
use crate::database::db_api::{
    get_all_albums, get_all_artists, get_all_genres, get_all_songs_in_db,
};
use crate::music::media_control_api::{set_player_state, update_metadata};
use crate::music::player::{
    get_song_position, load_a_song_from_path, load_and_play_song_from_path, pause_song,
    resume_playing, seek_by, seek_to, set_volume, stop_song,
};
use crate::music::rodio_player::{get_output_devices, set_output_device, get_default_output_device};
use crate::socials::discord_rpc::{
    allow_connection_and_connect_to_discord_rpc, attempt_to_connect_if_possible,
    clear_discord_rpc_activity, disallow_connection_and_close_discord_rpc,
    set_discord_rpc_activity,
};
use crate::utils::music_list_organizer::{
    mlo_get_next_batch_as_size, mlo_reset_and_set_remaining_keys, mlo_set_repeat_list,
    mlo_set_shuffle_list,
};
use app::setup::{
    setup_app,
    initialize_audio_manager,
    initialise_kira_audio_manager,
    initialise_rodio_audio_manager
};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, Some(vec![])))
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .manage(Arc::new(Mutex::new(
            DbManager::new().expect("failed to initialize db manager"),
        )))
        .manage(Mutex::new(MLO::new()))
        .manage(Mutex::new(
            DiscordRpc::new().expect("failed to initialize discord rpc"),
        ))
        .manage(initialize_audio_manager())
        .manage(initialise_kira_audio_manager())
        .manage(initialise_rodio_audio_manager())
        .setup(setup_app)
        .invoke_handler(tauri::generate_handler![
            // WINDOW CONTROL
            toggle_app_pin,
            toggle_miniplayer_view,
            drag_app_window,
            set_player_state,
            // GENERAL COMMANDS
            update_metadata,
            delete_song_metadata,
            get_all_songs,
            open_in_file_manager,
            set_volume,
            get_audio_dir,
            edit_song_metadata,
            get_server_port,
            refresh_paths,
            detect_deleted_songs,
            collect_env_args,
            // MUSIC PLAYER
            get_available_audio_backends,
            load_and_play_song_from_path,
            load_a_song_from_path,
            pause_song,
            resume_playing,
            stop_song,
            seek_to,
            seek_by,
            get_song_position,
            get_default_output_device,
            get_output_devices,
            set_output_device,
            set_playback_speed,
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
            clear_discord_rpc_activity,
            // EXPORT
            export_songs_as_csv,
            export_songs_as_json,
            export_songs_as_xml,
            export_songs_as_html,
            export_songs_as_txt,
            //export_songs_as_pdf,
            // IMPORT
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
