use std::{collections::HashSet, sync::{Arc, Mutex}};
use tabled::{builder::Builder, settings::Style};

use tauri::State;
use tauri_plugin_dialog::DialogExt;

use crate::{components::song::ExportSong, database::{db_api::get_songs_in_tree, db_manager::DbManager}, utils::general_utils::convert_single_to_double_backward_slash_on_path};

#[tauri::command]
pub async fn export_songs_as_txt(app: tauri::AppHandle, db_manager: State<'_, Arc<Mutex<DbManager>>>, uuids: Vec<String>, fields_to_include: Vec<String>) -> Result<(), String> {
    let songs = get_songs_in_tree(db_manager, uuids);

    let num_titles = songs.len();

    let unique_artists: HashSet<_> = songs.iter().map(|song| &song.artist).collect();
    let num_unique_artists = unique_artists.len();

    let unique_albums: HashSet<_> = songs.iter().map(|song| &song.album).collect();
    let num_unique_albums = unique_albums.len();

    let unique_genres: HashSet<_> = songs.iter().map(|song| &song.genre).collect();
    let num_unique_genres = unique_genres.len();

    let oldest_song = songs.iter().min_by_key(|song| song.year).map(|song| song.name.clone());
    let youngest_song = songs.iter().max_by_key(|song| song.year).map(|song| song.name.clone());

    let longest_song = songs.iter().max_by_key(|song| song.duration_seconds).map(|song| song.name.clone());
    let shortest_song = songs.iter().min_by_key(|song| song.duration_seconds).map(|song| song.name.clone());

    let largest_file = songs.iter().max_by_key(|song| song.file_size).map(|song| song.name.clone());
    let smallest_file = songs.iter().min_by_key(|song| song.file_size).map(|song| song.name.clone());

    let file_types: HashSet<_> = songs.iter().map(|song| &song.file_type).collect();
    
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

    let mut builder = Builder::new();

    let header_array = create_header(&fields_to_include);
    builder.push_record(header_array);
    
    let songs_array = export_songs.iter().map(|song| extract_fields_for_song(&song, &fields_to_include)).collect::<Vec<Vec<String>>>();
    
    for song in songs_array.iter(){
        builder.push_record(song);
    }
    
    let table = builder.build().with(Style::modern_rounded()).to_string();

    let txt = format!("Number of Titles: {}
Number of Unique Artists: {}
Number of Unique Albums: {}
Number of Unique Genres: {}
Oldest Song: {}
Youngest Song: {}
Longest Song: {}
Shortest Song: {}
Largest File: {}
Smallest File: {}
File Types: {}
Songs:
{}",
        num_titles, num_unique_artists, num_unique_albums, num_unique_genres, 
        oldest_song.unwrap_or("".to_string()), youngest_song.unwrap_or("".to_string()),
        longest_song.unwrap_or("".to_string()), shortest_song.unwrap_or("".to_string()),
        largest_file.unwrap_or("".to_string()), smallest_file.unwrap_or("".to_string()),
        serde_json::to_string(&file_types).unwrap_or("".to_string()),  
        table,
    );

    // then prompt user to save the file with dialog
    let file_path= app.dialog()
        .file()
        .add_filter("", &["txt"])
        .set_file_name("songs.txt")
        .blocking_save_file();

    if let Some(file_path) = file_path {
        match std::fs::write(file_path.to_string(), txt){
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string())
        }
    } else {
        Ok(())
    }
}

fn create_header(fields_to_include: &Vec<String>) -> Vec<String> {
    let mut header = Vec::new();
    for field in fields_to_include.iter(){
        match field.as_str(){
            "title" => header.push(format!("Title")),
            "artist" => header.push(format!("Artist")),
            "album" => header.push(format!("Album")),
            "genre" => header.push(format!("Genre")),
            "year" => header.push(format!("Year")),
            "duration" => header.push(format!("Duration")),
            "path" => header.push(format!("Path")),
            "date_recorded" => header.push(format!("Date Recorded")),
            "date_released" => header.push(format!("Date Released")),
            "file_size" => header.push(format!("File Size")),
            "file_type" => header.push(format!("File Type")),
            "overall_bit_rate" => header.push(format!("Overall Bit Rate")),
            "audio_bit_rate" => header.push(format!("Audio Bit Rate")),
            "sample_rate" => header.push(format!("Sample Rate")),
            "bit_depth" => header.push(format!("Bit Depth")),
            "channels" => header.push(format!("Channels")),
            _ => ()
        }
    }
    header
}

fn extract_fields_for_song(song: &ExportSong, fields_to_include: &Vec<String>) -> Vec<String>{
    let mut song_array = Vec::new();
    for field in fields_to_include.iter(){
        match field.as_str(){
            "title" => song_array.push(format!("{}", &song.title)),
            "artist" => song_array.push(format!("{}", &song.artist)),
            "album" => song_array.push(format!("{}", &song.album)),
            "genre" => song_array.push(format!("{}", &song.genre)),
            "year" => song_array.push(format!("{}", &song.year.to_string())),
            "duration" => song_array.push(format!("{}", &song.duration)),
            "path" => song_array.push(format!("{}", &convert_single_to_double_backward_slash_on_path(&song.path))),
            "date_recorded" => song_array.push(format!("{}", &song.date_recorded)),
            "date_released" => song_array.push(format!("{}", &song.date_released)),
            "file_size" => song_array.push(format!("{}", &song.file_size.to_string())),
            "file_type" => song_array.push(format!("{}", &song.file_type)),
            "overall_bit_rate" => song_array.push(format!("{}", &song.overall_bit_rate.to_string())),
            "audio_bit_rate" => song_array.push(format!("{}", &song.audio_bit_rate.to_string())),
            "sample_rate" => song_array.push(format!("{}", &song.sample_rate.to_string())),
            "bit_depth" => song_array.push(format!("{}", &song.bit_depth.to_string())),
            "channels" => song_array.push(format!("{}", &song.channels.to_string())),
            _ => ()
        }
    }

    song_array
}