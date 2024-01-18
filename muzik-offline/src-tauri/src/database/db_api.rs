use std::collections::HashMap;
use std::collections::HashSet;
use crate::components::{hmaptype::HMapType, song::Song, album::Album, artist::Artist, genre::Genre};
use super::{db_manager::DbManager, db_struct::ResponseObject};
use std::sync::Arc;
use sled::Tree;

//publicly available api functions
#[tauri::command]
pub async fn get_batch_of_songs(batch_size: usize, last_key: String) -> String{
    match DbManager::new(){
        Ok(dbm) => {
            
            let mut songs: Vec<Song> = Vec::new();
            let mut iter = dbm.song_tree.range(last_key.as_bytes()..);

            let could_retrieve_songs = tokio::task::spawn_blocking(move || { 
                for _ in 0..batch_size{
                    if let Some(Ok((_, song_as_ivec))) = iter.next() {
                        let song_as_bytes = song_as_ivec.as_ref();
                        let song_as_str = String::from_utf8_lossy(song_as_bytes);
                        match serde_json::from_str::<Song>(&song_as_str.to_string()){
                            Ok(song) => {
                                songs.push(song);
                            },
                            Err(_) => {
                                println!("error converting song from json to struct");
                            },
                        }
                    }
                    else{
                        break;
                    }
                }

                //convert songs vec to json and return
                match serde_json::to_string(&ResponseObject{
                    status: String::from("success"),
                    message: String::from(""),
                    data: songs
                }){
                    Ok(songs_as_json) => {
                        return songs_as_json;
                    },
                    Err(e) => {
                        return String::from(format!("{{\"status\":\"json parse error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                    },
                }
            }).await;

            match could_retrieve_songs{
                Ok(songs_as_json) => {
                    return songs_as_json;
                }
                Err(e) => {
                    return String::from(format!("{{\"status\":\"thread error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                }
            }
        }
        Err(e) => {
            return String::from(format!("{{\"status\":\"lock error\",\"message\":\"{}\",\"data\":[]}}", e));
        },
    }
}

#[tauri::command]
pub async fn get_batch_of_albums(batch_size: usize, last_key: String) -> String{
    match DbManager::new(){
        Ok(dbm) => {
            
            let mut albums: Vec<Album> = Vec::new();
            let mut iter = dbm.album_tree.range(last_key.as_bytes()..);

            let could_retrieve_albums = tokio::task::spawn_blocking(move || { 
                for _ in 0..batch_size{
                    if let Some(Ok((_, album_as_ivec))) = iter.next(){
                        let album_as_bytes = album_as_ivec.as_ref();
                        let album_as_str = String::from_utf8_lossy(album_as_bytes);
                        match serde_json::from_str::<Album>(&album_as_str.to_string()){
                            Ok(album) => {
                                albums.push(album);
                            },
                            Err(_) => {
                                println!("error converting album from json to struct");
                            },
                        }
                    }
                    else{
                        break;
                    }
                }

                //convert albums vec to json and return
                match serde_json::to_string(&ResponseObject{
                    status: String::from("success"),
                    message: String::from(""),
                    data: albums
                }){
                    Ok(albums_as_json) => {
                        return albums_as_json;
                    },
                    Err(e) => {
                        return String::from(format!("{{\"status\":\"json parse error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                    },
                }
            }).await;

            match could_retrieve_albums{
                Ok(albums_as_json) => {
                    return albums_as_json;
                }
                Err(e) => {
                    return String::from(format!("{{\"status\":\"thread error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                }
            }
        }
        Err(e) => {
            return String::from(format!("{{\"status\":\"lock error\",\"message\":\"{}\",\"data\":[]}}", e));
        },
    }
}

#[tauri::command]
pub async fn get_batch_of_artists(batch_size: usize, last_key: String) -> String{
    match DbManager::new(){
        Ok(dbm) => {

            let mut artists: Vec<Artist> = Vec::new();
            let mut iter = dbm.artist_tree.range(last_key.as_bytes()..);

            let could_retrieve_artists = tokio::task::spawn_blocking(move || { 
                for _ in 0..batch_size{
                    if let Some(Ok((_, artist_as_ivec))) = iter.next(){
                        let artist_as_bytes = artist_as_ivec.as_ref();
                        let artist_as_str = String::from_utf8_lossy(artist_as_bytes);
                        match serde_json::from_str::<Artist>(&artist_as_str.to_string()){
                            Ok(artist) => {
                                artists.push(artist);
                            },
                            Err(_) => {
                                println!("error converting artist from json to struct");
                            },
                        }
                    }
                    else{
                        break;
                    }
                }

                //convert artists vec to json and return
                match serde_json::to_string(&ResponseObject{
                    status: String::from("success"),
                    message: String::from(""),
                    data: artists
                }){
                    Ok(artists_as_json) => {
                        return artists_as_json;
                    },
                    Err(e) => {
                        return String::from(format!("{{\"status\":\"json parse error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                    },
                }
            }).await;

            match could_retrieve_artists{
                Ok(artists_as_json) => {
                    return artists_as_json;
                }
                Err(e) => {
                    return String::from(format!("{{\"status\":\"thread error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                }
            }
        }
        Err(e) => {
            return String::from(format!("{{\"status\":\"lock error\",\"message\":\"{}\",\"data\":[]}}", e));
        },
    }
}

#[tauri::command]
pub async fn get_batch_of_genres(batch_size: usize, last_key: String) -> String{
    
    match DbManager::new(){
        Ok(dbm) => {

            let mut genres: Vec<Genre> = Vec::new();
            let mut iter = dbm.artist_tree.range(last_key.as_bytes()..);

            let could_retrieve_genres = tokio::task::spawn_blocking(move || { 
                for _ in 0..batch_size{
                    if let Some(Ok((_, genre_as_ivec))) = iter.next(){
                        let genre_as_bytes = genre_as_ivec.as_ref();
                        let genre_as_str = String::from_utf8_lossy(genre_as_bytes);
                        match serde_json::from_str::<Genre>(&genre_as_str.to_string()){
                            Ok(genre) => {
                                genres.push(genre);
                            },
                            Err(_) => {
                                println!("error converting genre from json to struct");
                            },
                        }
                    }
                    else{
                        break;
                    }
                }

                //convert genres vec to json and return
                match serde_json::to_string(&ResponseObject{
                    status: String::from("success"),
                    message: String::from(""),
                    data: genres
                }){
                    Ok(genres_as_json) => {
                        return genres_as_json;
                    },
                    Err(e) => {
                        return String::from(format!("{{\"status\":\"json parse error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                    },
                }
            }).await;

            match could_retrieve_genres{
                Ok(genres_as_json) => {
                    return genres_as_json;
                }
                Err(e) => {
                    return String::from(format!("{{\"status\":\"thread error\",\"message\":\"{}\",\"data\":[]}}", e.to_string()));
                }
            }
        },
        Err(e) => {
            return String::from(format!("{{\"status\":\"lock error\",\"message\":\"{}\",\"data\":[]}}", e));
        },
    }
}

//backend functions

pub async fn start_bulk_insertion(
    songs: Vec<Song>,
    albums_hash_map: HashMap<String, HMapType>,
    artists_hash_map: HashMap<String, HMapType>,
    genres_hash_map: HashMap<String, HMapType> 
) -> Result<(), String>{
    match DbManager::new(){
        Ok(dbm) => {
            let dbm_arced = Arc::new(dbm);


            //store songs in tree asynchronously using tokio
            let could_insert_songs = {
                    let dbm_arced_clone = Arc::clone(&dbm_arced);
                    tokio::task::spawn_blocking(move || { 
                    insert_songs_into_tree(&dbm_arced_clone, &songs)
                }).await
            };

            match could_insert_songs{
                Ok(_) => {
                    
                },
                Err(e) => {
                    return Err(format!("{{\"status\":\"error\",\"message\":\"{}\"}}", e.to_string()));
                },
            }

            //store albums in tree asynchronously using tokio
            let could_insert_albums = {
                let dbm_arced_clone = Arc::clone(&dbm_arced);
                tokio::task::spawn_blocking(move || { 
                    insert_map_values_into_respective_tree(&dbm_arced_clone, &albums_hash_map, &String::from("albums"))
                }).await
            };

            match could_insert_albums{
                Ok(_) => {

                },
                Err(e) => {
                    return Err(format!("{{\"status\":\"error\",\"message\":\"{}\"}}", e.to_string()));
                },
            }

            //store artists in tree asynchronously using tokio
            let could_insert_artists = {
                let dbm_arced_clone = Arc::clone(&dbm_arced);
                tokio::task::spawn_blocking(move || { 
                    insert_map_values_into_respective_tree(&dbm_arced_clone, &artists_hash_map, &String::from("artists"))
                }).await
            };

            match could_insert_artists{
                Ok(_) => {

                },
                Err(e) => {
                    return Err(format!("{{\"status\":\"error\",\"message\":\"{}\"}}", e.to_string()));
                },
            }
            
            //store genres in tree asynchronously using tokio
            let could_insert_genres = {
                let dbm_arced_clone = Arc::clone(&dbm_arced);
                tokio::task::spawn_blocking(move || { 
                    insert_map_values_into_respective_tree(&dbm_arced_clone, &genres_hash_map, &String::from("genres"))
                }).await
            };

            match could_insert_genres{
                Ok(_) => {

                },
                Err(e) => {
                    return Err(format!("{{\"status\":\"error\",\"message\":\"{}\"}}", e.to_string()));
                },
            }



            return Ok(());
        },
        Err(e) => {
            return Err(format!("{{\"status\":\"error\",\"message\":\"{}\"}}", e.to_string()));
        },
    }
}

fn insert_map_values_into_respective_tree(dbm: &DbManager, hash_map: &HashMap<String, HMapType>, tree_name: &String){
    match tree_name.as_str(){
        "albums" => {
            insert_albums_into_tree(&dbm, &hash_map);
        },
        "artists" => {
            insert_artists_into_tree(&dbm, &hash_map);
        },
        "genres" => {
            insert_genres_into_tree(&dbm, &hash_map);
        },
        _ => {},
    }
}

pub fn save_paths_to_db(paths: &HashSet<String>){
    match DbManager::new(){
        Ok(dbm) => {
            for path in paths{
                match dbm.saved_directories.insert(path.as_bytes(), path.as_bytes()){
                    Ok(_) => {

                    },
                    Err(_) => {

                    },
                }
            }
        },
        Err(_) => {

        },
    }
}

pub fn get_existing_paths_as_hashset() -> HashSet<String>{
    let mut paths: HashSet<String> = HashSet::new();
    match DbManager::new(){
        Ok(dbm) => {
            let iter = dbm.saved_directories.iter();
            for iterable in iter{
                match iterable{
                    Ok(path_as_ivec) => {
                        let path_as_bytes = path_as_ivec.1.as_ref();
                        let path_as_str = String::from_utf8_lossy(path_as_bytes);
                        paths.insert(path_as_str.to_string());
                    },
                    Err(_) => {

                    },
                }
            }
        },
        Err(_) => {

        },
    }

    return paths;
}

pub fn compare_and_set_hash_map(hash_map: &mut HashMap<String, HMapType>, key: &String, value: &HMapType){
    match hash_map.get(key){
        Some(key_value) => {
            if key != "Unknown Album" && key != "Unknown Artist" && key != "Unknown Genre"{
                match &key_value.cover{
                    Some(_) => {
                        //don't tamper with the previous cover
                        return;
                    }
                    None => {
                        match &value.cover{
                            Some(cover) => {
                                //change the none cover to a some cover
                                hash_map.insert(key.to_string(), HMapType{
                                    key: value.key.clone(),
                                    cover: Some(cover.clone())
                                });
                            }
                            None => {
                                //don't tamper with the previous cover even though it's none
                                return;
                            }
                        }
                    }
                }
            }
        }
        None => {
            if key != "Unknown Album" && key != "Unknown Artist" && key != "Unknown Genre"{
                hash_map.insert(key.to_string(), HMapType{
                    key: value.key.clone(),
                    cover: value.cover.clone()
                });
            }
            else{
                hash_map.insert(key.to_string(), HMapType{
                    key: value.key.clone(),
                    cover: None
                });
            }
        }
    }
}

fn insert_songs_into_tree(dbm: &DbManager, songs: &Vec<Song>){
    //clear tree
    clear_tree(&dbm.song_tree);

    for song in songs{
        match serde_json::to_string(&song){
            Ok(song_as_json) => {
                match dbm.song_tree.insert(song.path.as_bytes(), song_as_json.as_bytes()){
                    Ok(_) => {
                        
                    },
                    Err(_) => {
                        
                    },
                }
            },
            Err(_) => {
                
            },
        }
    }
}

fn insert_albums_into_tree(dbm: &DbManager, hash_map: &HashMap<String, HMapType>){
    let mut albums: Vec<Album> = Vec::new();

    for (key, value) in hash_map{
        let album = Album{
            key: value.key.clone(), 
            cover: value.cover.clone(), 
            title: key.to_string()
        };
        albums.push(album);
    }

    //clear tree
    clear_tree(&dbm.album_tree);

    for album in albums{
        match serde_json::to_string(&album){
            Ok(album_as_json) => {
                match dbm.album_tree.insert(album.title.as_bytes(), album_as_json.as_bytes()){
                    Ok(_) => {
                        
                    },
                    Err(_) => {
                        
                    },
                }
            },
            Err(_) => {
                
            },
        }
    }
}

fn insert_artists_into_tree(dbm: &DbManager, hash_map: &HashMap<String, HMapType>){
    let mut artists: Vec<Artist> = Vec::new();

    for (key, value) in hash_map{
        let artist = Artist{
            key: value.key.clone(), 
            cover: value.cover.clone(), 
            artist_name: key.to_string()
        };
        artists.push(artist);
    }

    //clear tree
    clear_tree(&dbm.artist_tree);

    for artist in artists{
        match serde_json::to_string(&artist){
            Ok(artist_as_json) => {
                match dbm.artist_tree.insert(artist.artist_name.as_bytes(), artist_as_json.as_bytes()){
                    Ok(_) => {
                        
                    },
                    Err(_) => {
                        
                    },
                }
            },
            Err(_) => {
                
            },
        }
    }
}

fn insert_genres_into_tree(dbm: &DbManager, hash_map: &HashMap<String, HMapType>){
    let mut genres: Vec<Genre> = Vec::new();

    for (key, value) in hash_map{
        let genre = Genre{
            key: value.key.clone(), 
            cover: value.cover.clone(), 
            title: key.to_string()
        };
        genres.push(genre);
    }

    //clear tree
    clear_tree(&dbm.genre_tree);

    for genre in genres{
        match serde_json::to_string(&genre){
            Ok(genre_as_json) => {
                match dbm.genre_tree.insert(genre.title.as_bytes(), genre_as_json.as_bytes()){
                    Ok(_) => {
                        
                    },
                    Err(_) => {
                        
                    },
                }
            },
            Err(_) => {
                
            },
        }
    }
}

pub fn clear_tree(tree: &Tree){
    for key in tree.iter().keys(){
        match key{
            Ok(key_as_ivec) => {
                match tree.remove(key_as_ivec.as_ref()){
                    Ok(_) => {
                        
                    },
                    Err(_) => {
                        
                    },
                }
            },
            Err(_) => {
                
            },
        }
    }
}