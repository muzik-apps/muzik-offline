use crate::database::db_api::{
    delete_album_from_tree, delete_artist_from_tree, delete_genre_from_tree, delete_song_from_tree,
};
use crate::{
    components::audio_manager::AppAudioManager,
    database::db_manager::DbManager,
    utils::general_utils::{
        decode_image_in_parallel, encode_image_in_parallel, resize_and_compress_image,
    },
};
use dirs::{audio_dir, home_dir};
use std::path::PathBuf;
use std::{
    process::Command,
    sync::{Arc, Mutex},
};
use tauri::State;
use trash;

#[tauri::command]
pub fn collect_env_args() -> String {
    let args: Vec<String> = std::env::args().collect();

    // get first arg that ends with .ogg, .mp3, .flac, .wav
    let mut audio_path = String::new();
    for arg in args {
        if arg.ends_with(".ogg")
            || arg.ends_with(".mp3")
            || arg.ends_with(".flac")
            || arg.ends_with(".wav")
        {
            audio_path = arg;
            break;
        }
    }

    audio_path
}

#[tauri::command]
pub fn open_in_file_manager(file_path: &str) {
    open_file_at(&file_path);
}

#[tauri::command]
pub fn get_server_port(audio_manager: State<'_, Arc<Mutex<AppAudioManager>>>) -> u16 {
    match audio_manager.lock() {
        Ok(audio_manager) => {
            return audio_manager.port;
        }
        Err(_) => {
            return 0;
        }
    }
}

#[tauri::command]
pub async fn resize_frontend_image_to_fixed_height(
    image_as_str: String,
    height: u32,
) -> Result<String, String> {
    match decode_image_in_parallel(&image_as_str) {
        Ok(image) => match resize_and_compress_image(&image, &height as &u32) {
            Some(resized_image) => Ok(encode_image_in_parallel(&resized_image)),
            None => Err(String::from("FAILED")),
        },
        Err(_) => Err(String::from("FAILED")),
    }
}

#[tauri::command]
pub fn get_audio_dir() -> String {
    //get the audio path
    match audio_dir() {
        Some(path) => {
            match path.to_str() {
                Some(path) => {
                    //inserting this path won't have an effect if it already exists
                    return String::from(path);
                }
                None => {
                    return String::from("");
                }
            }
        }
        None => {
            return String::from("");
        }
    }
}

#[tauri::command]
pub fn get_lib_dir() -> Result<String, String> {
    let mut lib_path = PathBuf::new();
    match home_dir() {
        Some(path) => lib_path.push(path),
        None => return Err("Could not find home directory".to_string()),
    }
    lib_path.push("muzik-offline-local-data");
    lib_path.push("lib");

    // ensure lib directory exists otherwise create it
    if !lib_path.exists() {
        match std::fs::create_dir_all(&lib_path) {
            Ok(_) => {}
            Err(_) => return Err("Could not create lib directory".to_string()),
        }
    }

    match lib_path.to_str() {
        Some(path) => Ok(String::from(path)),
        None => Err("Could not find lib directory".to_string()),
    }
}

#[tauri::command]
pub fn get_waveform_dir() -> Result<String, String> {
    let mut lib_path = PathBuf::new();
    match home_dir() {
        Some(path) => lib_path.push(path),
        None => return Err("Could not find home directory".to_string()),
    }
    lib_path.push("muzik-offline-local-data");
    lib_path.push("waveform");

    // ensure waveform directory exists otherwise create it
    if !lib_path.exists() {
        match std::fs::create_dir_all(&lib_path) {
            Ok(_) => {}
            Err(_) => return Err("Could not create waveform directory".to_string()),
        }
    }

    match lib_path.to_str() {
        Some(path) => Ok(String::from(path)),
        None => Err("Could not find lib directory".to_string()),
    }
}

#[tauri::command]
pub async fn delete_song_metadata(
    db_manager: State<'_, Arc<Mutex<DbManager>>>,
    path: String,
    album: String,
    album_appearance_count: i32,
    artist: String,
    artist_appearance_count: i32,
    genre: String,
    genre_appearance_count: i32,
) -> Result<String, String> {
    // attempt to move file path to trash
    match trash::delete(&path) {
        Ok(_) => {}
        Err(e) => {
            return Err(format!("Failed to move file to trash because {}", e));
        }
    }

    // delete song from database
    delete_song_from_tree(db_manager.clone(), &path);

    // delete album from database if it has no more songs
    if album_appearance_count <= 1 {
        delete_album_from_tree(db_manager.clone(), &album);
    }

    // delete artist from database if it has no more songs
    if artist_appearance_count <= 1 {
        delete_artist_from_tree(db_manager.clone(), &artist);
    }

    // delete genre from database if it has no more songs
    if genre_appearance_count <= 1 {
        delete_genre_from_tree(db_manager.clone(), &genre);
    }

    Ok(String::from("SUCCESS"))
}

#[cfg(target_os = "macos")]
fn open_file_at(file_path: &str) {
    match Command::new("open")
        .arg("-R")
        .arg(file_path) // <- Specify the directory you'd like to open.
        .spawn()
    {
        Ok(_) => {}
        Err(_) => {}
    }
}

#[cfg(target_os = "windows")]
fn open_file_at(file_path: &str) {
    match Command::new("explorer")
        .arg("/select,")
        .arg(file_path) // <- Specify the directory you'd like to open.
        .spawn()
    {
        Ok(_) => {}
        Err(_) => {}
    }
}

#[cfg(target_os = "linux")]
fn open_file_at(file_path: &str) {
    match Command::new("xdg-open")
        .arg(file_path) // <- Specify the directory you'd like to open.
        .spawn()
    {
        Ok(_) => {}
        Err(_) => {}
    }
}
