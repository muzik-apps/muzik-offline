//this file should contain commands and functions that facilitate the refreshing
//or rather rechecking of the file paths the user gave to see if any new music has been loaded
//or if any music has been deleted and changing the library accordingly.
use dirs::audio_dir;
use crate::database::db_api::{get_existing_paths_as_hashset, save_paths_to_db,
    is_key_contained_in_album_tree, is_key_contained_in_artist_tree, is_key_contained_in_genre_tree,
    insert_song_into_tree, insert_album_into_tree, insert_artist_into_tree, insert_genre_into_tree,
    is_key_contained_in_song_tree};
use crate::utils::general_utils::string_to_uuid;
use super::metadata_retriever::read_from_path;

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

#[tauri::command]
pub async fn check_if_songs_have_changed_in_paths(compress_image_option: bool) -> Result<String, String> {
    //get previously saved paths
    let paths = get_existing_paths_as_hashset();
    let mut new_song_keys: Vec<String> = Vec::new();

    for folder_path in &paths{
        new_song_keys.append(&mut discover_songs_at_paths(&folder_path, &compress_image_option).await);
    }

    //convert to json and return
    match serde_json::to_string(&new_song_keys){
        Ok(json_string) => {
            Ok(format!("{{\"status\":\"success\",\"message\":\"{} new songs found\",data:{}}}", new_song_keys.len(), json_string))
        },
        Err(_) => {
            Err(String::from("{\"status\":\"error\",\"message\":\"could not perform conversion\",data:[]}"))
        }
    }
}

async fn discover_songs_at_paths(folder_path: &String, compress_image_option: &bool) -> Vec<String>{
    let mut new_song_keys: Vec<String> = Vec::new();

    match tokio::fs::read_dir(folder_path).await {
        Ok(mut paths) => {
            while let Ok(Some(entry)) = paths.next_entry().await {
                match entry.path().to_str(){
                    Some(full_path) => {
                        let uuid = string_to_uuid(full_path);
                        match insert_into_trees(&uuid, &full_path, &compress_image_option).await{
                            Ok(is_new_song) => {
                                if is_new_song{
                                    new_song_keys.push(uuid.to_string());
                                }
                            }
                            Err(_) => {}
                        }
                    }
                    None => {},
                }
            }
        },
        Err(_) => {},
    }

    new_song_keys
}

async fn insert_into_trees(uuid: &String, path: &str, compress_image_option: &bool) -> Result<bool, String> {
    let song;

    //check if the song is already in the song tree
    if is_key_contained_in_song_tree(&uuid)?{
        return Ok(false);
    }
    else{
        match read_from_path(&path, &mut 0, &compress_image_option).await{
            Ok(song_data) =>{
                song = song_data;
            }
            Err(_) => {
                return Ok(false);
            }
        }
    }

    //insert the song into the song tree
    insert_song_into_tree(&song);

    //check if the album is already in the album tree and insert it if it isn't
    if is_key_contained_in_album_tree(&song.album)? == false{
        insert_album_into_tree(&song);
    }

    //check if the artist is already in the artist tree and insert it if it isn't
    if is_key_contained_in_artist_tree(&song.artist)? == false{
        insert_artist_into_tree(&song);
    }

    //check if the genre is already in the genre tree and insert it if it isn't
    if is_key_contained_in_genre_tree(&song.genre)? == false{
        insert_genre_into_tree(&song);
    }

    Ok(true)
}