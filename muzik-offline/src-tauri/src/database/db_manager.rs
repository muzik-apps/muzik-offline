use sled::{Db, Tree};
use std::path::PathBuf;
use dirs::home_dir;

use crate::constants::constant_values::DATABASE_VERSION;
use super::db_api::clear_tree;

pub struct DbManager{
    pub db: Db,
    pub song_tree: Tree,
    pub album_tree: Tree,
    pub artist_tree: Tree,
    pub genre_tree: Tree,
    pub saved_directories: Tree,
}

impl DbManager{
    pub fn new() -> Result<Self, String> {
        let mut db_path = PathBuf::new();
        match home_dir() {
            Some(path) => db_path.push(path),
            None => return Err("Could not find home directory".to_string()),
        }
        db_path.push("muzik-offline-local-data");
        db_path.push("db");
        let db: Db = sled::open(db_path).map_err(|e| e.to_string())?;
        let song_tree: Tree = db.open_tree(b"songs").map_err(|e| e.to_string())?;
        let album_tree: Tree = db.open_tree(b"albums").map_err(|e| e.to_string())?;
        let artist_tree: Tree = db.open_tree(b"artists").map_err(|e| e.to_string())?;
        let genre_tree: Tree = db.open_tree(b"genres").map_err(|e| e.to_string())?;
        let saved_directories: Tree = db.open_tree(b"saved_directories").map_err(|e| e.to_string())?;

        match configure_database(
            &db,
            &song_tree,
            &album_tree,
            &artist_tree,
            &genre_tree,
            &saved_directories) {
                Ok(_) => {

                },
                Err(e) => {
                    return Err(e);
                },
            }

        Ok(
            DbManager{
                db,
                song_tree,
                album_tree,
                artist_tree,
                genre_tree,
                saved_directories,
            }
        )
    }
}

pub fn configure_database(
    db: &Db,
    song_tree: &Tree,
    album_tree: &Tree,
    artist_tree: &Tree,
    genre_tree: &Tree,
    saved_directories: &Tree,
) -> Result<String, String>{
    match db.get(b"version"){
        Ok(Some(current_version)) => {
            // The version key exists, so the database has already been initialized
            // Check if the version is lower than the current version
            match current_version.as_ref().try_into(){
                Ok(current_version_as_bytes) => {
                    let current_version_as_u32 = u32::from_ne_bytes(current_version_as_bytes);
                    if current_version_as_u32 < DATABASE_VERSION {
                        // The database is outdated, so we need to clear it
                        clear_tree(&song_tree);
                        clear_tree(&album_tree);
                        clear_tree(&artist_tree);
                        clear_tree(&genre_tree);
                        clear_tree(&saved_directories);
                        // Set the new version
                        db.insert(b"version", &DATABASE_VERSION.to_ne_bytes()).map_err(|e| e.to_string())?;
                    }
                    return Ok(String::from("SUCCESS"));
                },
                Err(_) => {
                    db.insert(b"version", &DATABASE_VERSION.to_ne_bytes()).map_err(|e| e.to_string())?;
                    return Ok(String::from("SUCCESS"));
                },
            }
        },
        Ok(None) => {
            // The version key does not exist, so the database has not been initialized yet
            // Set the new version
            db.insert(b"version", &DATABASE_VERSION.to_ne_bytes()).map_err(|e| e.to_string())?;
            return Ok(String::from("SUCCESS"));
        },
        Err(_) => {
            // The version key does not exist, so the database has not been initialized yet
            // Set the new version
            db.insert(b"version", &DATABASE_VERSION.to_ne_bytes()).map_err(|e| e.to_string())?;
            return Ok(String::from("SUCCESS"));
        },
    }
}