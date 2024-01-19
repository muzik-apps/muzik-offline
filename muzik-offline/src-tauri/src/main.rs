// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod music;
mod components;
mod utils;
mod database;
mod socials;

use kira::manager::{AudioManager,AudioManagerSettings,backend::DefaultBackend};
use components::audio_manager::SharedAudioManager;
use utils::music_list_organizer::MLO;
use crate::socials::discord_rpc::DiscordRpc;
use std::sync::Mutex;

use crate::commands::metadata_retriever::get_all_songs;

use crate::commands::general_commands::{open_in_file_manager, resize_frontend_image_to_fixed_height};

use crate::music::player::{load_and_play_song_from_path, load_a_song_from_path, set_volume,
    pause_song, resume_playing, seek_to, get_song_position, stop_song};

use crate::utils::music_list_organizer::{mlo_set_shuffle_list, mlo_set_repeat_list, 
    mlo_get_next_batch_as_size, mlo_reset_and_set_remaining_keys};

use crate::database::db_api::{get_batch_of_songs, get_batch_of_albums, get_batch_of_artists, get_batch_of_genres,};

use crate::socials::discord_rpc::{allow_connection_and_connect_to_discord_rpc,
    attempt_to_connect_if_possible, disallow_connection_and_close_discord_rpc,
    set_discord_rpc_activity, clear_discord_rpc_activity};

use dotenv::dotenv;

fn main() {
    tauri::Builder::default()
        .setup(|_| {
            //init env variables
            dotenv().ok();
            Ok(())
        })
        .manage(Mutex::new(SharedAudioManager {
            //this expect is necessary because if the audio manager fails to initialize, the application should not run
            //since we would not be able to play any audio if it fails to initialize
            manager: AudioManager::<DefaultBackend>::new(AudioManagerSettings::default()).expect("failed to initialize audio manager"),
            instance_handle: None,
        }))
        .manage(Mutex::new(MLO::new()))
        .manage(Mutex::new(DiscordRpc::new().expect("failed to initialize discord rpc")))
        .invoke_handler(tauri::generate_handler![
                            //GENERAL COMMANDS
                            get_all_songs, 
                            open_in_file_manager,
                            set_volume,

                            //MUSIC PLAYER
                            load_and_play_song_from_path,
                            load_a_song_from_path,
                            pause_song,
                            resume_playing,
                            stop_song,
                            seek_to,
                            get_song_position,

                            //UTILS
                            resize_frontend_image_to_fixed_height,

                            //MUSIC LIST ORGANIZER
                            mlo_set_shuffle_list,
                            mlo_set_repeat_list,
                            mlo_reset_and_set_remaining_keys,
                            mlo_get_next_batch_as_size,

                            //DATABASE API
                            get_batch_of_songs, 
                            get_batch_of_albums, 
                            get_batch_of_artists, 
                            get_batch_of_genres,

                            //DISCORD RPC
                            allow_connection_and_connect_to_discord_rpc,
                            attempt_to_connect_if_possible, 
                            disallow_connection_and_close_discord_rpc,
                            set_discord_rpc_activity, 
                            clear_discord_rpc_activity
                        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}