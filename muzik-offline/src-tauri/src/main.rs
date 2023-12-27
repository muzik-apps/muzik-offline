// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod metadata_retriever;
mod components;
mod commands;
mod player;
mod utils;

use kira::manager::{AudioManager,AudioManagerSettings,backend::DefaultBackend};
use components::SharedAudioManager;
use std::sync::Mutex;

use crate::metadata_retriever::get_all_songs;
use crate::commands::open_in_file_manager;
use crate::player::{load_and_play_song_from_path, load_a_song_from_path,
    pause_song, resume_playing, seek_to, get_song_position, stop_song};
use crate::commands::resize_frontend_image_to_fixed_height;

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(SharedAudioManager {
            //this expect is necessary because if the audio manager fails to initialize, the application should not run
            //since we would not be able to play any audio if it fails to initialize
            manager: AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()).expect("failed to initialize audio manager"),
            instance_handle: None,
        }))
        .invoke_handler(tauri::generate_handler![
                            get_all_songs, 
                            open_in_file_manager,
                            load_and_play_song_from_path,
                            load_a_song_from_path,
                            pause_song,
                            resume_playing,
                            stop_song,
                            seek_to,
                            get_song_position,
                            resize_frontend_image_to_fixed_height
                        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}