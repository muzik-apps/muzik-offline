//this file should contain commands and functions that facilitate the refreshing
//or rather rechecking of the file paths the user gave to see if any new music has been loaded
//or if any music has been deleted and changing the library accordingly.

use std::sync::{Arc, Mutex};
use tauri::State;

use crate::database::{
    db_api::{delete_song_from_tree, get_song_paths},
    db_manager::DbManager,
};

use super::metadata_retriever::{decode_directories, get_songs_in_path};

#[tauri::command]
pub async fn refresh_paths(
    db_manager: State<'_, Arc<Mutex<DbManager>>>,
    paths_as_json_array: String,
    compress_image_option: bool,
    max_depth: usize,
) -> Result<String, String> {
    let paths_as_vec = decode_directories(&paths_as_json_array);

    let song_id = Arc::new(Mutex::new(0));
    let mut new_songs_detected = 0;
    for path in &paths_as_vec {
        new_songs_detected += get_songs_in_path(
            db_manager.clone(),
            &path,
            song_id.clone(),
            compress_image_option,
            true,
            max_depth
        )
        .await;
    }

    match new_songs_detected {
        0 => Ok("No new songs detected".to_string()),
        _ => Ok(format!("{} new songs detected", new_songs_detected)),
    }
}

#[tauri::command]
pub fn detect_deleted_songs(
    db_manager: State<'_, Arc<Mutex<DbManager>>>,
) -> Result<String, String> {
    let paths_as_vec = get_song_paths(db_manager.clone());
    let mut delete_uuids = Vec::new();

    for (uuid, path) in &paths_as_vec {
        // check if the song still exists
        match std::fs::metadata(path) {
            Ok(_) => continue,
            Err(_) => {
                // delete the song from the database
                delete_song_from_tree(db_manager.clone(), &uuid);
                delete_uuids.push(uuid.clone());
            }
        }
    }

    match delete_uuids.len() {
        0 => {
            let empty_vec_as_json = serde_json::to_string(&delete_uuids)
                .unwrap_or("Error serializing deleted songs".to_string());
            Ok(empty_vec_as_json)
        }
        _ => {
            let delete_uuids_as_json = serde_json::to_string(&delete_uuids)
                .unwrap_or("Error serializing deleted songs".to_string());
            Ok(delete_uuids_as_json)
        }
    }
}
