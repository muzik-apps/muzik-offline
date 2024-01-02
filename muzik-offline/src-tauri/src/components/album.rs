use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Album{
    pub key: i32,
    pub cover: Option<String>,
    pub title: String,
}