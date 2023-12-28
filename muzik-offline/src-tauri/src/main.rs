// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod metadata_retriever;
mod components;
mod commands;
mod player;
mod utils;
mod music_list_organizer;

use kira::manager::{AudioManager,AudioManagerSettings,backend::DefaultBackend};
use components::SharedAudioManager;
use music_list_organizer::MLO;
use std::sync::Mutex;

use crate::metadata_retriever::get_all_songs;

use crate::commands::{open_in_file_manager, resize_frontend_image_to_fixed_height};

use crate::player::{load_and_play_song_from_path, load_a_song_from_path, set_volume,
    pause_song, resume_playing, seek_to, get_song_position, stop_song};

use crate::music_list_organizer::{mlo_set_shuffle_list, mlo_set_repeat_list, 
    mlo_get_next_batch_as_size, mlo_reset_and_set_remaining_keys};

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(SharedAudioManager {
            //this expect is necessary because if the audio manager fails to initialize, the application should not run
            //since we would not be able to play any audio if it fails to initialize
            manager: AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()).expect("failed to initialize audio manager"),
            instance_handle: None,
        }))
        .manage(Mutex::new(MLO::new()))
        .invoke_handler(tauri::generate_handler![
                            get_all_songs, 
                            open_in_file_manager,
                            set_volume,
                            load_and_play_song_from_path,
                            load_a_song_from_path,
                            pause_song,
                            resume_playing,
                            stop_song,
                            seek_to,
                            get_song_position,
                            resize_frontend_image_to_fixed_height,
                            mlo_set_shuffle_list,
                            mlo_set_repeat_list,
                            mlo_reset_and_set_remaining_keys,
                            mlo_get_next_batch_as_size,
                        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}