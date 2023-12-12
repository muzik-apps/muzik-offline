use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct Song {
    pub id: i32,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub genre: String,
    pub year: i32,
    pub duration: String,
    pub path: String,
    pub cover: String,
    pub date_recorded: String,
    pub date_released: String,
    pub file_size: i32,
    pub file_type: String,
}

#[derive(Serialize, Deserialize)]
pub struct Dir {
    pub directories: Vec<String>,
}