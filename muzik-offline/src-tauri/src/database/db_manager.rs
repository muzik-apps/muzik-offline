use dirs::home_dir;
use sled::{Db, Tree};
use std::path::PathBuf;
use std::sync::RwLock;

use crate::constants::null_cover_four::NULL_COVER_FOUR;
use crate::constants::null_cover_null::NULL_COVER_NULL;
use crate::constants::null_cover_one::NULL_COVER_ONE;
use crate::constants::null_cover_three::NULL_COVER_THREE;
use crate::constants::null_cover_two::NULL_COVER_TWO;
use crate::utils::general_utils::decode_image_in_parallel;

use super::db_api::key_exists_in_tree;

pub struct DbManager {
    pub song_tree: RwLock<Tree>,
    pub album_tree: RwLock<Tree>,
    pub artist_tree: RwLock<Tree>,
    pub genre_tree: RwLock<Tree>,
    pub covers_tree: RwLock<Tree>,
    pub thumbnails_tree: RwLock<Tree>,
    pub wallpapers_tree: RwLock<Tree>,
    pub null_covers_tree: RwLock<Tree>,
}

impl DbManager {
    pub fn new() -> Result<Self, String> {
        let mut db_path = PathBuf::new();
        match home_dir() {
            Some(path) => db_path.push(path),
            None => return Err("Could not find home directory".to_string()),
        }
        db_path.push("muzik-offline-local-data");
        db_path.push("db");
        let db: Db = sled::open(db_path).map_err(|e| e.to_string())?;
        let song_tree = db.open_tree(b"songs").map_err(|e| e.to_string())?;
        let album_tree = db.open_tree(b"albums").map_err(|e| e.to_string())?;
        let artist_tree = db.open_tree(b"artists").map_err(|e| e.to_string())?;
        let genre_tree = db.open_tree(b"genres").map_err(|e| e.to_string())?;
        let covers_tree = db.open_tree(b"covers").map_err(|e| e.to_string())?;
        let thumbnails_tree = db.open_tree(b"thumbnails").map_err(|e| e.to_string())?;
        let wallpapers_tree = db.open_tree(b"wallpapers").map_err(|e| e.to_string())?;
        let null_covers_tree = db.open_tree(b"null_covers").map_err(|e| e.to_string())?;

        // check if null_covers tree has all the 5 null covers
        insert_null_cover(&null_covers_tree, "NULL_COVER_NULL", NULL_COVER_NULL)?;
        insert_null_cover(&null_covers_tree, "NULL_COVER_ONE", NULL_COVER_ONE)?;
        insert_null_cover(&null_covers_tree, "NULL_COVER_TWO", NULL_COVER_TWO)?;
        insert_null_cover(&null_covers_tree, "NULL_COVER_THREE", NULL_COVER_THREE)?;
        insert_null_cover(&null_covers_tree, "NULL_COVER_FOUR", NULL_COVER_FOUR)?;

        Ok(DbManager {
            song_tree: RwLock::new(song_tree),
            album_tree: RwLock::new(album_tree),
            artist_tree: RwLock::new(artist_tree),
            genre_tree: RwLock::new(genre_tree),
            covers_tree: RwLock::new(covers_tree),
            thumbnails_tree: RwLock::new(thumbnails_tree),
            wallpapers_tree: RwLock::new(wallpapers_tree),
            null_covers_tree: RwLock::new(null_covers_tree),
        })
    }
}

fn insert_null_cover(null_covers_tree: &Tree, key: &str, cover_data: &str) -> Result<(), String> {
    if !key_exists_in_tree(&null_covers_tree, key.to_string()) {
        let cover = decode_image_in_parallel(&cover_data.to_owned()).map_err(|e| e.to_string())?;
        null_covers_tree.insert(key, cover).map_err(|e| e.to_string())?;
    }
    Ok(())
}