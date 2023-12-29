use serde::Serialize;

#[derive(Serialize)]
pub struct Album{
    pub id: i32,
    pub key: i32,
    pub cover: Option<String>,
    pub title: String,
}