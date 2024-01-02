use std::collections::HashMap;
use crate::components::{hmaptype::HMapType, song::Song, album::Album, artist::Artist, genre::Genre};
use crate::database::db_manager::DbManager;
use sled::Tree;
use std::sync::Arc;

//publicly available api functions
#[tauri::command]
pub fn get_batch_of_songs(batch_size: usize, last_id: u32) -> String{
    let mut songs: Vec<Song> = Vec::new();

    match DbManager::new(){
        Ok(dbm) => {

            let keys = get_next_keys(&dbm.song_tree, last_id, batch_size);
            for key in keys{
                match dbm.song_tree.get(key.to_ne_bytes()){
                    Ok(Some(song_as_ivec)) => {
                        let song_as_bytes = song_as_ivec.as_ref();
                        let song_as_str = String::from_utf8_lossy(song_as_bytes);
                        match serde_json::from_str::<Song>(&song_as_str.to_string()){
                            Ok(song) => {
                                songs.push(song);
                            },
                            Err(_) => {
                                
                            },
                        }
                    },
                    Ok(None) => {

                    },
                    Err(_) => {

                    },
                }
            }
        }
        Err(_) => {
            return String::from("[]");
        },
    }

    //convert songs vec to json and return
    match serde_json::to_string(&songs){
        Ok(songs_as_json) => {
            return songs_as_json;
        },
        Err(_) => {
            return String::from("[]");
        },
    }
}

#[tauri::command]
pub fn get_batch_of_albums(batch_size: usize, last_id: u32) -> String{
    let mut albums: Vec<Album> = Vec::new();
    
    match DbManager::new(){
        Ok(dbm) => {

            let keys = get_next_keys(&dbm.album_tree, last_id, batch_size);
            for key in keys{
                match dbm.album_tree.get(key.to_ne_bytes()){
                    Ok(Some(album_as_ivec)) => {
                        let album_as_bytes = album_as_ivec.as_ref();
                        let album_as_str = String::from_utf8_lossy(album_as_bytes);
                        match serde_json::from_str::<Album>(&album_as_str.to_string()){
                            Ok(album) => {
                                albums.push(album);
                            },
                            Err(_) => {
                                
                            },
                        }
                    },
                    Ok(None) => {

                    },
                    Err(_) => {

                    },
                }
            }
        }
        Err(_) => {
            return String::from("[]");
        },
    }

    //convert albums vec to json and return
    match serde_json::to_string(&albums){
        Ok(albums_as_json) => {
            return albums_as_json;
        },
        Err(_) => {
            return String::from("[]");
        },
    }
}

#[tauri::command]
pub fn get_batch_of_artists(batch_size: usize, last_id: u32) -> String{
    let mut artists: Vec<Artist> = Vec::new();
    
    match DbManager::new(){
        Ok(dbm) => {
            let keys = get_next_keys(&dbm.artist_tree, last_id, batch_size);
            for key in keys{
                match dbm.artist_tree.get(key.to_ne_bytes()){
                    Ok(Some(artist_as_ivec)) => {
                        let artist_as_bytes = artist_as_ivec.as_ref();
                        let artist_as_str = String::from_utf8_lossy(artist_as_bytes);
                        match serde_json::from_str::<Artist>(&artist_as_str.to_string()){
                            Ok(artist) => {
                                artists.push(artist);
                            },
                            Err(_) => {
                                
                            },
                        }
                    },
                    Ok(None) => {

                    },
                    Err(_) => {

                    },
                }
            }
        }
        Err(_) => {
            return String::from("[]");
        },
    }

    //convert artists vec to json and return
    match serde_json::to_string(&artists){
        Ok(artists_as_json) => {
            return artists_as_json;
        },
        Err(_) => {
            return String::from("[]");
        },
    }
}

#[tauri::command]
pub fn get_batch_of_genres(batch_size: usize, last_id: u32) -> String{
    let mut genres: Vec<Genre> = Vec::new();
    
    match DbManager::new(){
        Ok(dbm) => {
            let keys = get_next_keys(&dbm.genre_tree, last_id, batch_size);
            for key in keys{
                match dbm.genre_tree.get(key.to_ne_bytes()){
                    Ok(Some(genre_as_ivec)) => {
                        let genre_as_bytes = genre_as_ivec.as_ref();
                        let genre_as_str = String::from_utf8_lossy(genre_as_bytes);
                        match serde_json::from_str::<Genre>(&genre_as_str.to_string()){
                            Ok(genre) => {
                                genres.push(genre);
                            },
                            Err(_) => {
                                
                            },
                        }
                    },
                    Ok(None) => {

                    },
                    Err(_) => {

                    },
                }
            }
        },
        Err(_) => {

        },
    }

    //convert genres vec to json and return
    match serde_json::to_string(&genres){
        Ok(genres_as_json) => {
            return genres_as_json;
        },
        Err(_) => {
            return String::from("[]");
        },
    }
}

//backend functions

pub async fn start_insertion(
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

pub fn compare_and_set_hash_map(hash_map: &mut HashMap<String, HMapType>, key: &String, value: &HMapType){
    match hash_map.get(key){
        Some(key_value) => {
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
        None => {
            hash_map.insert(key.to_string(), HMapType{
                key: value.key.clone(),
                cover: value.cover.clone()
            });
        }
    }
}

fn insert_songs_into_tree(dbm: &DbManager, songs: &Vec<Song>){
    //clear the song tree
    clear_tree(&dbm.song_tree);

    for song in songs{
        match serde_json::to_string(&song){
            Ok(song_as_json) => {
                match dbm.song_tree.insert(song.id.to_ne_bytes(), song_as_json.as_bytes()){
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

    //clear the album tree
    clear_tree(&dbm.album_tree);

    for album in albums{
        match serde_json::to_string(&album){
            Ok(album_as_json) => {
                match dbm.album_tree.insert(album.key.to_ne_bytes(), album_as_json.as_bytes()){
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

    //clear the artist tree
    clear_tree(&dbm.artist_tree);

    for artist in artists{
        match serde_json::to_string(&artist){
            Ok(artist_as_json) => {
                match dbm.artist_tree.insert(artist.key.to_ne_bytes(), artist_as_json.as_bytes()){
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

    //clear the genre tree
    clear_tree(&dbm.genre_tree);

    for genre in genres{
        match serde_json::to_string(&genre){
            Ok(genre_as_json) => {
                match dbm.genre_tree.insert(genre.key.to_ne_bytes(), genre_as_json.as_bytes()){
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

fn get_next_keys(tree: &Tree, start_key: u32, count: usize) -> Vec<u32> {
    let mut keys = Vec::with_capacity(count);
    let mut iter = tree.range(start_key.to_be_bytes()..);

    for _ in 0..count {
        if let Some(Ok((key_bytes, _))) = iter.next() {
            match key_bytes.as_ref().try_into(){
                Ok(key_array) => {
                    keys.push(u32::from_be_bytes(key_array));
                },
                Err(_) => {
                    break;
                },
            }
        } else {
            break;
        }
    }

    keys
}

fn clear_tree(tree: &Tree){
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
