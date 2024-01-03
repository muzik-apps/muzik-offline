use serde::Serialize;

#[derive(Serialize)]
pub struct ResponseObject<T>{
    pub status: String,
    pub message: String,
    pub data: Vec<T>,
}