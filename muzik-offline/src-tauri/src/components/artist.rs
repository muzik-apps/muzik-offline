use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Artist{
    pub key: i32,
    pub cover: Option<String>,
    pub artist_name: String,
}