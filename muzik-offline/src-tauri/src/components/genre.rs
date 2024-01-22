use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Genre{
    pub key: String,
    pub cover: Option<String>,
    pub title: String,
}