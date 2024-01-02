use sled::{Db, Tree};

pub struct DbManager{
    pub db: Db,
    pub song_tree: Tree,
    pub album_tree: Tree,
    pub artist_tree: Tree,
    pub genre_tree: Tree,
}

impl DbManager{
    pub fn new() -> Result<Self, String> {
        let db: Db = sled::open("db").map_err(|e| e.to_string())?;
        let song_tree: Tree = db.open_tree(b"songs").map_err(|e| e.to_string())?;
        let album_tree: Tree = db.open_tree(b"albums").map_err(|e| e.to_string())?;
        let artist_tree: Tree = db.open_tree(b"artists").map_err(|e| e.to_string())?;
        let genre_tree: Tree = db.open_tree(b"genres").map_err(|e| e.to_string())?;

        Ok(
            DbManager{
                db,
                song_tree,
                album_tree,
                artist_tree,
                genre_tree,
            }
        )
    }
}