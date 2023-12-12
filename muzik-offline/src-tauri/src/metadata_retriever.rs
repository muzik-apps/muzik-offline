use std::fs::{self};
use id3::{Tag, TagLike};
use mp3_duration;

use crate::components::{Song, Dir};

pub fn decode_directories(paths_as_json: &str) -> Vec<String> {
    let paths_converted_or_err: Result<Dir, serde_json::Error> = serde_json::from_str(paths_as_json);
    
    match paths_converted_or_err{
        Ok(paths_converted) => {return paths_converted.directories},
        Err(_) => {return Vec::new()},
    }
}

pub fn get_songs_in_path(dir_path: &str) -> Vec<Song>{
    let mut songs: Vec<Song> = Vec::new();

    match fs::read_dir(dir_path) {
        Ok(paths) => {
            for path in paths {
                match read_from_path(path.as_ref().unwrap().path().to_str().unwrap()) {
                    Ok(mut song_data) => {
                        //FILE SIZE
                        song_data.file_size = 0;//TODO: PLEASE FIX THIS
        
                        //FILE TYPE
                        song_data.file_type = String::from("mp3");//TODO: PLEASE FIX THIS
        
                        songs.push(song_data);
                    },
                    Err(_) => {},
                }
            }
        },
        Err(_) => { return songs; },
    }

    songs 
}

fn read_from_path(path: &str) -> Result<Song, Box<dyn std::error::Error>> {
    let tag = Tag::read_from_path(path)?;

    let mut song_meta_data = Song {
        id: 0,
        title: String::from(""),
        artist: String::from(""),
        album: String::from(""),
        genre: String::from(""),
        year: 0,
        duration: String::from(""),
        path: String::from(""),
        cover: String::from(""),
        date_recorded: String::from(""),
        date_released: String::from(""),
        file_size: 0,
        file_type: String::from("")
    };

    //TITLE
    if let Some(title) = tag.title() {
        song_meta_data.title = title.to_owned();
    }
    else{
        song_meta_data.title = String::from("Unknown Title");
    }
    
    //ARTIST
    if let Some(artist) = tag.artist() {
        song_meta_data.artist = artist.to_owned();
    }
    else{
        song_meta_data.artist = String::from("Unknown Artist");
    }

    //ALBUM
    if let Some(album) = tag.album() {
        song_meta_data.album = album.to_owned();
    }
    else{
        song_meta_data.album = String::from("album: Unknown Album");
    }

    //GENRE
    if let Some(genre) = tag.genre() {
        song_meta_data.genre = genre.to_owned();
    }
    else{
        song_meta_data.genre = String::from("genre: Unknown Genre");
    }

    //YEAR
    if let Some(year) = tag.year() {
        song_meta_data.year = year.to_owned();
    }
    else{
        song_meta_data.year = 0;
    }

    //DURATION
    let duration = mp3_duration::from_path(&path).unwrap();
    song_meta_data.duration = duration_to_string(duration);

    //PATH
    song_meta_data.path = path.clone().to_owned();

    //COVER
    song_meta_data.cover = String::from("No cover");

    //DATE RECORDED
    //"YYYY-MM-DD-HH-MM-SS"
    if let Some(date_recorded) = tag.date_recorded() {
        song_meta_data.date_recorded = date_recorded.year.to_string() + "-";
    }
    else{
        song_meta_data.date_recorded = String::from("Unknown date recorded");
    }

    //DATE RELEASED
    //"YYYY-MM-DD-HH-MM-SS"
    if let Some(date_released) = tag.date_released() {
        song_meta_data.date_released = date_released.year.to_string() + "-";
    }
    else{
        song_meta_data.date_released = String::from("Unknown date recorded");
    }

    Ok(song_meta_data)
}

fn duration_to_string(duration: std::time::Duration) -> String {
    let seconds = duration.as_secs();
    let minutes = seconds / 60;
    let seconds = seconds % 60;
    let hours = minutes / 60;
    let minutes = minutes % 60;

    if hours > 0 {
        format!("{}:{:02}:{:02}", hours, minutes, seconds)
    } else {
        format!("{}:{:02}", minutes, seconds)
    }
}