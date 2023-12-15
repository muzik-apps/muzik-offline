// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod metadata_retriever;
mod components;

use components::Song;
use metadata_retriever::{get_songs_in_path, decode_directories};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
    //this serves as an example template whenever new commands are to be created
    //so don't delete this
}

#[tauri::command]
async fn get_all_songs(paths_as_json_array: String) -> Result<String, String> {
    let paths_as_vec = decode_directories(&paths_as_json_array);

    let mut songs: Vec<Song> = Vec::new();
    let mut song_id: i32 = 0;
    for path in &paths_as_vec{
        songs.extend(get_songs_in_path(&path, &mut song_id).await);
    }

    match serde_json::to_string(&songs){
        Ok(json) => { Ok(json.into())},
        Err(_) => {Err("{\"error\":\"failed to parse json object\"}".into())},
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_all_songs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}