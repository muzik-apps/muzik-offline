use serde::Serialize;

#[derive(Serialize)]
pub struct Artist{
    pub id: i32,
    pub key: i32,
    pub cover: Option<String>,
    pub artist_name: String,
}
