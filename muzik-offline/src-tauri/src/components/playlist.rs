use serde::Serialize;

#[derive(Serialize)]
pub struct Playlist{
    pub id: i32,
    pub key: i32,
    pub cover: Option<String>,
    pub title: String,
    pub date_created: String,
    pub date_edited: String,
    pub tracks_paths: Vec<String>,
}