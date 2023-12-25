// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod metadata_retriever;
mod components;
mod commands;
mod player;

use std::sync::Mutex;
use kira::manager::{AudioManager,AudioManagerSettings,backend::DefaultBackend};
use components::SharedAudioManager;

use crate::metadata_retriever::get_all_songs;
use crate::commands::open_in_file_manager;
use crate::player::{play_sound, pause_sound, resume_playing};

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(SharedAudioManager {
            //this unwrap is necessary because if the audio manager fails to initialize, the application should not run
            //since we would not be able to play any audio if it fails to initialize
            manager: AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()).unwrap(),
        }))
        .invoke_handler(tauri::generate_handler![
                            greet, 
                            get_all_songs, 
                            open_in_file_manager,
                            play_sound,
                            pause_sound,
                            resume_playing
                        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
    //this serves as an example template whenever new commands are to be created
    //so don't delete this
}