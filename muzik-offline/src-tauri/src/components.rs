use serde::Serialize;
use kira::{manager::{AudioManager, backend::DefaultBackend}, sound::{streaming::StreamingSoundHandle, FromFileError}};

#[derive(Serialize)]
pub struct Song {
    pub id: i32,
    pub title: String,
    pub name: String,
    pub artist: String,
    pub album: String,
    pub genre: String,
    pub year: i32,
    pub duration: String,
    pub duration_seconds: u64,
    pub path: String,
    pub cover: Option<String>,
    pub date_recorded: String,
    pub date_released: String,
    pub file_size: u64,
    pub file_type: String,
}

pub struct SharedAudioManager {
    pub manager: AudioManager<DefaultBackend>,
    pub instance_handle: Option<StreamingSoundHandle<FromFileError>>,
}