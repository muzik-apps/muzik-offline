// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod metadata_retriever;
mod components;
mod commands;
mod player;
mod utils;
mod shuffler;
mod normalplaylist;

use kira::manager::{AudioManager,AudioManagerSettings,backend::DefaultBackend};
use components::SharedAudioManager;
use shuffler::Shuffler;
use normalplaylist::NormalPlayList;
use std::sync::Mutex;

use crate::metadata_retriever::get_all_songs;

use crate::commands::{open_in_file_manager, resize_frontend_image_to_fixed_height};

use crate::player::{load_and_play_song_from_path, load_a_song_from_path,
    pause_song, resume_playing, seek_to, get_song_position, stop_song};

use crate::shuffler::{shuffler_set_total_songs, shuffler_set_batch_size, 
    shuffler_get_next_batch, shuffler_get_next_batch_as_size, 
    shuffler_set_total_songs_and_batch_size, shuffler_reset_and_set_remaining_keys};

use crate::normalplaylist::{normalplaylist_set_total_songs, normalplaylist_set_batch_size,
    normalplaylist_get_next_batch, normalplaylist_get_next_batch_as_size,
    normalplaylist_set_total_songs_and_batch_size, normalplaylist_reset_and_set_remaining_keys};

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(SharedAudioManager {
            //this expect is necessary because if the audio manager fails to initialize, the application should not run
            //since we would not be able to play any audio if it fails to initialize
            manager: AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()).expect("failed to initialize audio manager"),
            instance_handle: None,
        }))
        .manage(Mutex::new(Shuffler::new(0, 0)))
        .manage(Mutex::new(NormalPlayList::new(0, 0)))
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
                            resize_frontend_image_to_fixed_height,
                            shuffler_set_total_songs,
                            shuffler_set_batch_size,
                            shuffler_set_total_songs_and_batch_size,
                            shuffler_reset_and_set_remaining_keys,
                            shuffler_get_next_batch,
                            shuffler_get_next_batch_as_size,
                            normalplaylist_set_total_songs,
                            normalplaylist_set_batch_size,
                            normalplaylist_set_total_songs_and_batch_size,
                            normalplaylist_reset_and_set_remaining_keys,
                            normalplaylist_get_next_batch,
                            normalplaylist_get_next_batch_as_size,
                        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}