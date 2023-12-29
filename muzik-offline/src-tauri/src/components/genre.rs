use serde::Serialize;

#[derive(Serialize)]
pub struct Genre{
    pub id: i32,
    pub key: i32,
    pub cover: Option<String>,
    pub genre_name: String,
}