use sled::{Db, Tree};
use std::path::PathBuf;
use dirs::home_dir;

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