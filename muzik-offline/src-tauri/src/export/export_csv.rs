use std::sync::{Arc, Mutex};

use tauri::State;
use tauri_plugin_dialog::DialogExt;

use crate::{components::song::ExportSong, database::{db_api::get_songs_in_tree, db_manager::DbManager}, utils::general_utils::convert_single_to_double_backward_slash_on_path};

#[tauri::command]
pub async fn export_songs_as_csv(app: tauri::AppHandle, db_manager: State<'_, Arc<Mutex<DbManager>>>, uuids: Vec<String>, fields_to_include: Vec<String>) -> Result<(), String> {
    let songs = get_songs_in_tree(db_manager, uuids);
    
    // convert song to appriopriate json format and add to json array
    let export_songs: Vec<ExportSong> = songs.iter().map(|song| {
        ExportSong {
            title: song.title.clone(),
            artist: song.artist.clone(),
            album: song.album.clone(),
            genre: song.genre.clone(),
            year: song.year,
            duration: song.duration.clone(),
            path: song.path.clone(),
            date_recorded: song.date_recorded.clone(),
            date_released: song.date_released.clone(),
            file_size: song.file_size,
            file_type: song.file_type.clone(),
            overall_bit_rate: song.overall_bit_rate,
            audio_bit_rate: song.audio_bit_rate,
            sample_rate: song.sample_rate,
            bit_depth: song.bit_depth,
            channels: song.channels,
        }
    }).collect();

    let mut csv = String::new();
    csv.push_str(&extract_fields_for_header(&fields_to_include));
    
    for song in export_songs.iter(){
        csv.push_str(&extract_fields_for_song(&song, &fields_to_include));
    }

    // then prompt user to save the file with dialog
    let file_path= app.dialog()
        .file()
        .add_filter("", &["csv"])
        .set_file_name("songs.csv")
        .blocking_save_file();

    if let Some(file_path) = file_path {
        match std::fs::write(file_path.to_string(), csv){
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string())
        }
    } else {
        Ok(())
    }
}

fn extract_fields_for_header(fields_to_include: &Vec<String>) -> String{
    let mut header = String::new();
    for field in fields_to_include.iter(){
        match field.as_str(){
            "title" => header.push_str("title,"),
            "artist" => header.push_str("artist,"),
            "album" => header.push_str("album,"),
            "genre" => header.push_str("genre,"),
            "year" => header.push_str("year,"),
            "duration" => header.push_str("duration,"),
            "path" => header.push_str("path,"),
            "date_recorded" => header.push_str("date_recorded,"),
            "date_released" => header.push_str("date_released,"),
            "file_size" => header.push_str("file_size,"),
            "file_type" => header.push_str("file_type,"),
            "overall_bit_rate" => header.push_str("overall_bit_rate,"),
            "audio_bit_rate" => header.push_str("audio_bit_rate,"),
            "sample_rate" => header.push_str("sample_rate,"),
            "bit_depth" => header.push_str("bit_depth,"),
            "channels" => header.push_str("channels,"),
            _ => ()
        }
    }
    
    if header.ends_with(","){
        header.pop();
    }
    header.push_str("\n");
    header
}

fn extract_fields_for_song(song: &ExportSong, fields_to_include: &Vec<String>) -> String{
    let mut csv = String::new();
    for field in fields_to_include.iter(){
        match field.as_str(){
            "title" => csv.push_str(&format!("{},", song.title)),
            "artist" => csv.push_str(&format!("{},", song.artist)),
            "album" => csv.push_str(&format!("{},", song.album)),
            "genre" => csv.push_str(&format!("{},", song.genre)),
            "year" => csv.push_str(&format!("{},", song.year)),
            "duration" => csv.push_str(&format!("{},", song.duration)),
            "path" => csv.push_str(&format!("{},", convert_single_to_double_backward_slash_on_path(&song.path))),
            "date_recorded" => csv.push_str(&format!("{},", song.date_recorded)),
            "date_released" => csv.push_str(&format!("{},", song.date_released)),
            "file_size" => csv.push_str(&format!("{},", song.file_size)),
            "file_type" => csv.push_str(&format!("{},", song.file_type)),
            "overall_bit_rate" => csv.push_str(&format!("{},", song.overall_bit_rate)),
            "audio_bit_rate" => csv.push_str(&format!("{},", song.audio_bit_rate)),
            "sample_rate" => csv.push_str(&format!("{},", song.sample_rate)),
            "bit_depth" => csv.push_str(&format!("{},", song.bit_depth)),
            "channels" => csv.push_str(&format!("{},", song.channels)),
            _ => ()
        }
    }
    
    if csv.ends_with(","){
        csv.pop();
    }
    csv.push_str("\n");
    csv
}