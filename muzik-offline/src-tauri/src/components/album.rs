use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Album{
    pub key: String,
    pub cover: Option<String>,
    pub title: String,
}