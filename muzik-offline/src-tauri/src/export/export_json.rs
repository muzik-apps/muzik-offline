use std::{collections::HashSet, sync::{Arc, Mutex}};

use tauri::State;
use tauri_plugin_dialog::DialogExt;

use crate::{components::song::ExportSong, database::{db_api::get_songs_in_tree, db_manager::DbManager}, utils::general_utils::convert_single_to_double_backward_slash_on_path};

#[tauri::command]
pub async fn export_songs_as_json(app: tauri::AppHandle, db_manager: State<'_, Arc<Mutex<DbManager>>>, uuids: Vec<String>, fields_to_include: Vec<String>) -> Result<(), String> {
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

    let json_songs = export_songs.iter().map(|song| extract_song(song, &fields_to_include)).collect::<Vec<String>>().join(",\n");

    let json = format!(r#"{{
    "num_titles": {},
    "num_unique_artists": {},
    "num_unique_albums": {},
    "num_unique_genres": {},
    "oldest_song_by_year": "{}",
    "youngest_song_by_year": "{}",
    "longest_song_by_length": "{}",
    "shortest_song_by_length": "{}",
    "largest_song_by_size": "{}",
    "smallest_song_by_size": "{}",
    "file_types": {},
    "songs": [
{}
    ]
}}"#, num_titles, num_unique_artists, num_unique_albums, num_unique_genres, 
        oldest_song.unwrap_or("".to_string()), youngest_song.unwrap_or("".to_string()),
        longest_song.unwrap_or("".to_string()), shortest_song.unwrap_or("".to_string()),
        largest_file.unwrap_or("".to_string()), smallest_file.unwrap_or("".to_string()),
        serde_json::to_string(&file_types).unwrap_or("".to_string()), json_songs);

    // then prompt user to save the file with dialog
    let file_path= app.dialog()
        .file()
        .add_filter("", &["json"])
        .set_file_name("songs.json")
        .blocking_save_file();

    if let Some(file_path) = file_path {
        match std::fs::write(file_path.to_string(), json){
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string())
        }
    } else {
        Ok(())
    }
}

fn extract_song(song: &ExportSong, fields_to_include: &Vec<String>) -> String{
    let mut json = "\t\t{\n".to_string();
    for field in fields_to_include{
        match field.as_str(){
            "title" => json.push_str(&format!("\t\t\t\"title\": \"{}\",\n", song.title)),
            "artist" => json.push_str(&format!("\t\t\t\"artist\": \"{}\",\n", song.artist)),
            "album" => json.push_str(&format!("\t\t\t\"album\": \"{}\",\n", song.album)),
            "genre" => json.push_str(&format!("\t\t\t\"genre\": \"{}\",\n", song.genre)),
            "year" => json.push_str(&format!("\t\t\t\"year\": {},\n", song.year)),
            "duration" => json.push_str(&format!("\t\t\t\"duration\": \"{}\",\n", song.duration)),
            "path" => json.push_str(&format!("\t\t\t\"path\": \"{}\",\n", convert_single_to_double_backward_slash_on_path(&song.path))),
            "date_recorded" => json.push_str(&format!("\t\t\t\"date_recorded\": \"{}\",\n", song.date_recorded)),
            "date_released" => json.push_str(&format!("\t\t\t\"date_released\": \"{}\",\n", song.date_released)),
            "file_size" => json.push_str(&format!("\t\t\t\"file_size\": {},\n", song.file_size)),
            "file_type" => json.push_str(&format!("\t\t\t\"file_type\": \"{}\",\n", song.file_type)),
            "overall_bit_rate" => json.push_str(&format!("\t\t\t\"overall_bit_rate\": {},\n", song.overall_bit_rate)),
            "audio_bit_rate" => json.push_str(&format!("\t\t\t\"audio_bit_rate\": {},\n", song.audio_bit_rate)),
            "sample_rate" => json.push_str(&format!("\t\t\t\"sample_rate\": {},\n", song.sample_rate)),
            "bit_depth" => json.push_str(&format!("\t\t\t\"bit_depth\": {},\n", song.bit_depth)),
            "channels" => json.push_str(&format!("\t\t\t\"channels\": {},\n", song.channels)),
            _ => {}
        }
    }
    json.pop();
    json.pop();
    json.push_str("\n\t\t}");
    json
}