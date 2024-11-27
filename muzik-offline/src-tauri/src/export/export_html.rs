use std::{collections::HashSet, sync::{Arc, Mutex}};

use tauri::State;
use tauri_plugin_dialog::DialogExt;

use crate::{components::song::ExportSong, database::{db_api::get_songs_in_tree, db_manager::DbManager}, utils::general_utils::convert_single_to_double_backward_slash_on_path};

#[tauri::command]
pub async fn export_songs_as_html(app: tauri::AppHandle, db_manager: State<'_, Arc<Mutex<DbManager>>>, uuids: Vec<String>, fields_to_include: Vec<String>) -> Result<(), String> {
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

    let songs_html = export_songs.iter().map(|song| extract_fields_for_song(&song, &fields_to_include)).collect::<String>();

    let html = format!("<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <style>{}</style>
    <title>Muzik-offline</title>
</head>
<body>
    <h1>Muzik-offline</h1>
    <h2>Number of title: {}</h2>
    <h2>Number of unique artists: {}</h2>
    <h2>Number of unique albums: {}</h2>
    <h2>Number of unique genres: {}</h2>
    <h2>Oldest song: {}</h2>
    <h2>Youngest song: {}</h2>
    <h2>Longest song: {}</h2>
    <h2>Shortest song: {}</h2>
    <h2>Largest file: {}</h2>
    <h2>Smallest file: {}</h2>
    <h2>File types: {}</h2>
    <table>
        <tr>{}</tr>
{}</table>
</body>
</html>", 
        create_css_styles(),
        num_titles, num_unique_artists, num_unique_albums, num_unique_genres, 
        oldest_song.unwrap_or("".to_string()), youngest_song.unwrap_or("".to_string()),
        longest_song.unwrap_or("".to_string()), shortest_song.unwrap_or("".to_string()),
        largest_file.unwrap_or("".to_string()), smallest_file.unwrap_or("".to_string()),
        serde_json::to_string(&file_types).unwrap_or("".to_string()), 
        extract_fields_for_header(&fields_to_include), songs_html
    );

    // then prompt user to save the file with dialog
    let file_path= app.dialog()
        .file()
        .add_filter("", &["html"])
        .set_file_name("songs.html")
        .blocking_save_file();

    if let Some(file_path) = file_path {
        match std::fs::write(file_path.to_string(), html){
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string())
        }
    } else {
        Ok(())
    }
}

fn create_css_styles() -> String{
    format!("
        body{{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }}
        h1{{
            text-align: center;
            margin-top: 20px;
        }}
        h2{{
            margin-top: 20px;
        }}
        table{{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td{{
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
    ")
}

fn extract_fields_for_header(fields_to_include: &Vec<String>) -> String {
    let mut header = String::new();
    header.push('\n');
    for field in fields_to_include.iter(){
        match field.as_str(){
            "title" => header.push_str("\t\t\t<th>Title</th>\n"),
            "artist" => header.push_str("\t\t\t<th>Artist</th>\n"),
            "album" => header.push_str("\t\t\t<th>Album</th>\n"),
            "genre" => header.push_str("\t\t\t<th>Genre</th>\n"),
            "year" => header.push_str("\t\t\t<th>Year</th>\n"),
            "duration" => header.push_str("\t\t\t<th>Duration</th>\n"),
            "path" => header.push_str("\t\t\t<th>Path</th>\n"),
            "date_recorded" => header.push_str("\t\t\t<th>Date Recorded</th>\n"),
            "date_released" => header.push_str("\t\t\t<th>Date Released</th>\n"),
            "file_size" => header.push_str("\t\t\t<th>File Size</th>\n"),
            "file_type" => header.push_str("\t\t\t<th>File Type</th>\n"),
            "overall_bit_rate" => header.push_str("\t\t\t<th>Overall Bit Rate</th>\n"),
            "audio_bit_rate" => header.push_str("\t\t\t<th>Audio Bit Rate</th>\n"),
            "sample_rate" => header.push_str("\t\t\t<th>Sample Rate</th>\n"),
            "bit_depth" => header.push_str("\t\t\t<th>Bit Depth</th>\n"),
            "channels" => header.push_str("\t\t\t<th>Channels</th>\n"),
            _ => ()
        }
    }
    header.push('\t');
    header.push('\t');
    header
}

fn extract_fields_for_song(song: &ExportSong, fields_to_include: &Vec<String>) -> String{
    let mut song_str = String::new();
    song_str.push_str("\t\t<tr>\n");
    for field in fields_to_include.iter(){
        match field.as_str(){
            "title" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.title)),
            "artist" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.artist)),
            "album" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.album)),
            "genre" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.genre)),
            "year" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.year)),
            "duration" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.duration)),
            "path" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", convert_single_to_double_backward_slash_on_path(&song.path))),
            "date_recorded" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.date_recorded)),
            "date_released" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.date_released)),
            "file_size" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.file_size)),
            "file_type" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.file_type)),
            "overall_bit_rate" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.overall_bit_rate)),
            "audio_bit_rate" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.audio_bit_rate)),
            "sample_rate" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.sample_rate)),
            "bit_depth" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.bit_depth)),
            "channels" => song_str.push_str(&format!("\t\t\t<td>{}</td>\n", song.channels)),
            _ => ()
        }
    }
    song_str.push_str("\t\t</tr>\n");
    song_str
}