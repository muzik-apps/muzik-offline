use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Song {
    pub id: i32,
    pub title: String,
    pub name: String,
    pub artist: String,
    pub album: String,
    pub genre: String,
    pub year: u32,
    pub duration: String,
    pub duration_seconds: u64,
    pub path: String,
    pub cover: Option<String>,
    pub date_recorded: String,
    pub date_released: String,
    pub file_size: u64,
    pub file_type: String,
    pub overall_bit_rate: u32,
    pub audio_bit_rate: u32,
    pub sample_rate: u32,
    pub bit_depth: u8,
    pub channels: u8,
}