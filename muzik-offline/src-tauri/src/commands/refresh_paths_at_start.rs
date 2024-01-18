//this file should contain commands and functions that facilitate the refreshing
//or rather rechecking of the file paths the user gave to see if any new music has been loaded
//or if any music has been deleted and changing the library accordingly.
use dirs::audio_dir;
use crate::database::db_api::{get_existing_paths_as_hashset, save_paths_to_db};

#[tauri::command]
pub fn get_the_audio_path() -> String {//this function should only be invoked when the application starts and never again
    //get previously saved paths
    let mut paths = get_existing_paths_as_hashset();

    //get the audio path
    match audio_dir() {
        Some(path) => {
            match path.to_str(){
                Some(path) => {
                    //inserting this path won't have an effect if it already exists
                    paths.insert(String::from(path));
                },
                None => {
                    
                }
            }
        },
        None => {
            
        }
    }

    //save the paths
    save_paths_to_db(&paths);

    //return the paths as a json string by converting the set to a vector first
    match serde_json::to_string(&paths.into_iter().collect::<Vec<String>>()){
        Ok(json_string) => {
            json_string
        },
        Err(_) => {
            String::from("[]")
        }
    }
}

pub async fn check_if_songs_have_changed_in_paths(compress_image_option: bool) -> bool {
    //get previously saved paths
    let mut paths = get_existing_paths_as_hashset();

    for folder_path in &paths{
        discover_songs_at_paths(&folder_path, &compress_image_option).await;
    }

    false
}

async fn discover_songs_at_paths(folder_path: &String,compress_image_option: &bool){
    let mut song_paths: Vec<String> = Vec::new();

    match tokio::fs::read_dir(folder_path).await {
        Ok(mut paths) => {
            while let Ok(Some(entry)) = paths.next_entry().await {
                match entry.path().to_str(){
                    Some(full_path) => {
                        
                    }
                    None => {},
                }
            }
        },
        Err(_) => {},
    }
}