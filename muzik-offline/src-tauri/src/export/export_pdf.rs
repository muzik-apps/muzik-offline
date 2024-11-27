/*
TODO: Fix this code in the future

use std::{collections::HashSet, sync::{Arc, Mutex}};

use tauri::State;
use printpdf::*;
use tauri_plugin_dialog::DialogExt;

use crate::{components::song::ExportSong, database::{db_api::get_songs_in_tree, db_manager::DbManager}};

#[tauri::command]
pub async fn export_songs_as_pdf(app: tauri::AppHandle, db_manager: State<'_, Arc<Mutex<DbManager>>>, uuids: Vec<String>, fields_to_include: Vec<String>) -> Result<(), String> {
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

    // Create a PDF document
    let (mut document, page1, layer1) =
        PdfDocument::new("Muzik offline", Mm(210.0), Mm(297.0), "Layer 1");

    // Get the current layer
    let current_layer = document.get_page(page1).get_layer(layer1);

    // Add H1 title using sans-serif font
    current_layer.use_text("Muzik-offline", 48.0, Mm(10.0), Mm(270.0), &Standard14Font::HelveticaBold); <- Error here

    // then prompt user to save the file with dialog
    let file_path= app.dialog()
        .file()
        .add_filter("My Filter", &["txt"])
        .blocking_save_file();

    if let Some(file_path) = file_path {
        match std::fs::write(file_path.to_string(), ""){
            Ok(_) => Ok(()),
            Err(e) => Err(e.to_string())
        }
    } else {
        Ok(())
    }
}*/