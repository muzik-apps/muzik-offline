use std::{path::Path, collections::HashMap};
use id3::TagLike;
use serde_json::Value;
use crate::utils::general_utils::encode_image_in_parallel;
use crate::database::db_api::{
    compare_and_set_hash_map, 
    start_insertion,
};
use lofty::{ AudioFile, Probe};
use crate::utils::general_utils::{duration_to_string, extract_file_name, resize_and_compress_image};
use crate::components::{song::Song, hmaptype::HMapType};
use lofty::TaggedFileExt;

#[tauri::command]
pub async fn get_all_songs(paths_as_json_array: String, compress_image_option: bool) -> Result<String, String> {
    
    let paths_as_vec = decode_directories(&paths_as_json_array);

    let mut songs: Vec<Song> = Vec::new();
    let mut albums_hash_map: HashMap<String, HMapType> = HashMap::new();
    let mut artists_hash_map: HashMap<String, HMapType> = HashMap::new();
    let mut genres_hash_map: HashMap<String, HMapType> = HashMap::new();

    let mut song_id: i32 = 0;
    for path in &paths_as_vec{
        songs.extend(get_songs_in_path(
            &path, 
            &mut song_id, 
            &compress_image_option,
            &mut albums_hash_map,
            &mut artists_hash_map,
            &mut genres_hash_map
        ).await);
    }

    let songs_vec_len = songs.len();

    match start_insertion(songs, albums_hash_map, artists_hash_map, genres_hash_map).await{
        Ok(_) => {
            if songs_vec_len.to_string() == song_id.to_string(){
                return Ok("{\"status\":\"success\"}".into());
            }
            else {
                return Err("{\"status\":\"error\",\"message\":\"the song id does not match song length\"}".into());
            }
        },
        Err(e) => {
            return Err(e);
        },
    }
}

pub fn decode_directories(paths_as_json: &str) -> Vec<String> {
    let parsed_json: Result<Value, serde_json::Error> = serde_json::from_str(paths_as_json);

    match parsed_json {
        Ok(parsed_json) => {
            // Ensure the parsed JSON is an array
            if let Value::Array(array) = parsed_json {
                // Convert each element to a String
                let string_vec: Vec<String> = array
                    .iter()
                    .filter_map(|v| v.as_str().map(|s| s.to_string()))
                    .collect();

                return string_vec;
            } else {
                return Vec::new();
            }
        },
        Err(_) => {return Vec::new()},
    }
}

pub async fn get_songs_in_path(
    dir_path: &str, 
    song_id: &mut i32, 
    compress_image_option: &bool,
    albums_hash_map: &mut HashMap<String, HMapType>,
    artists_hash_map: &mut HashMap<String, HMapType>,
    genres_hash_map: &mut HashMap<String, HMapType> 
) -> Vec<Song>{
    let mut songs: Vec<Song> = Vec::new();

    match tokio::fs::read_dir(dir_path).await {
        Ok(mut paths) => {
            while let Ok(Some(entry)) = paths.next_entry().await {
                match entry.path().to_str(){
                    Some(full_path) => {
                        if let Ok(song_data) = read_from_path(full_path, song_id, compress_image_option) {
                            let hmt: HMapType = HMapType{key: song_data.id.clone(), cover: song_data.cover.clone()};
                            compare_and_set_hash_map(albums_hash_map, &song_data.album, &hmt);
                            compare_and_set_hash_map(artists_hash_map, &song_data.artist, &hmt);
                            compare_and_set_hash_map(genres_hash_map, &song_data.genre, &hmt);
                            songs.push(song_data);
                        }
                        else if let Ok(song_data) = lofty_read_from_path(full_path, song_id, compress_image_option){
                            let hmt: HMapType = HMapType{key: song_data.id.clone(), cover: song_data.cover.clone()};
                            compare_and_set_hash_map(albums_hash_map, &song_data.album, &hmt);
                            compare_and_set_hash_map(artists_hash_map, &song_data.artist, &hmt);
                            compare_and_set_hash_map(genres_hash_map, &song_data.genre, &hmt);
                            songs.push(song_data);
                        }
                        else{
                            
                        }
                    }
                    None => {

                    },
                }
            }
        },
        Err(_) => {

        },
    }

    songs 
}

fn lofty_read_from_path(
    path: &str, 
    song_id: &mut i32, 
    compress_image_option: &bool
) -> Result<Song, Box<dyn std::error::Error>> {
    *song_id += 1;

    let mut song_meta_data = Song {
        id: *song_id,
        title: String::from(""),
        name: String::from(""),
        artist: String::from(""),
        album: String::from(""),
        genre: String::from(""),
        year: 0,
        duration: String::from(""),
        duration_seconds: 0,
        path: String::from(""),
        cover: None,
        date_recorded: String::from(""),
        date_released: String::from(""),
        file_size: 0,
        file_type: String::from(""),
        overall_bit_rate: 0,
        audio_bit_rate: 0,
        sample_rate: 0,
        bit_depth: 0,
        channels: 0,
    };

    match lofty::read_from_path(path){
        Ok(tagged_file) => {
            match tagged_file.first_tag(){
                Some(tag) => {
                    set_title_lofty(tag, &mut song_meta_data);
                    set_name(&path, &mut song_meta_data);
                    set_artist_lofty(tag, &mut song_meta_data);
                    set_album_lofty(tag, &mut song_meta_data);
                    set_genre_lofty(tag, &mut song_meta_data);
                    set_year_lofty(tag, &mut song_meta_data);
                    set_duration_bit_rate_sample_rate_bit_depth_channels(&path, &mut song_meta_data);
                    set_path(&path, &mut song_meta_data);
                    set_cover_lofty(tag, &mut song_meta_data, compress_image_option);
                    set_date_recorded_lofty(tag, &mut song_meta_data);
                    set_date_released_lofty(tag, &mut song_meta_data);
                    set_file_size(&path, &mut song_meta_data);
                    set_file_extension(&path, &mut song_meta_data);
                }
                None => {
                    *song_id -= 1;
                    return Err("Error opening file".into());
                }
            }
        },
        Err(_) => {
            *song_id -= 1;
            return Err("Error opening file".into());
        },
    }

    Ok(song_meta_data)
}

fn read_from_path(
    path: &str, song_id: &mut i32, 
    compress_image_option: &bool
) -> Result<Song, Box<dyn std::error::Error>> {
    let tag = id3::Tag::read_from_path(path)?;
    *song_id += 1;

    let mut song_meta_data = Song {
        id: *song_id,
        title: String::from(""),
        name: String::from(""),
        artist: String::from(""),
        album: String::from(""),
        genre: String::from(""),
        year: 0,
        duration: String::from(""),
        duration_seconds: 0,
        path: String::from(""),
        cover: None,
        date_recorded: String::from(""),
        date_released: String::from(""),
        file_size: 0,
        file_type: String::from(""),
        overall_bit_rate: 0,
        audio_bit_rate: 0,
        sample_rate: 0,
        bit_depth: 0,
        channels: 0,
    };

    set_title(&tag, &mut song_meta_data);
    set_name(&path, &mut song_meta_data);
    set_artist(&tag, &mut song_meta_data);
    set_album(&tag, &mut song_meta_data);
    set_genre(&tag, &mut song_meta_data);
    set_year(&tag, &mut song_meta_data);
    set_duration_bit_rate_sample_rate_bit_depth_channels(&path, &mut song_meta_data);
    set_path(&path, &mut song_meta_data);
    set_cover(&tag, &mut song_meta_data, compress_image_option);
    set_date_recorded(&tag, &mut song_meta_data);
    set_date_released(&tag, &mut song_meta_data);
    set_file_size(&path, &mut song_meta_data);
    set_file_extension(&path, &mut song_meta_data);

    Ok(song_meta_data)
}

fn set_title(tag: &id3::Tag, song_meta_data: &mut Song){
    //TITLE
    if let Some(title) = tag.title() {
        song_meta_data.title = title.to_owned();
    }
    else{
        song_meta_data.title = String::from("Unknown Title");
    }
}

fn set_title_lofty(audio_file: &lofty::Tag , song_meta_data: &mut Song){
    //TITLE
    if let Some(title) = lofty::Accessor::title(audio_file) {
        song_meta_data.title = title.to_string();
    }
    else{
        song_meta_data.title = String::from("Unknown Title");
    }
}

fn set_name(path: &str, song_meta_data: &mut Song){
    //NAME
    song_meta_data.name = extract_file_name(&path);
}

fn set_artist(tag: &id3::Tag, song_meta_data: &mut Song){
    //ARTIST
    if let Some(artist) = tag.artist() {
        song_meta_data.artist = artist.to_owned();
    }
    else{
        song_meta_data.artist = String::from("Unknown Artist");
    }
}

fn set_artist_lofty(audio_file: &lofty::Tag, song_meta_data: &mut Song){
    //ARTIST
    if let Some(artist) = lofty::Accessor::artist(audio_file) {
        song_meta_data.artist = artist.to_string();
    }
    else{
        song_meta_data.artist = String::from("Unknown Artist");
    }
}

fn set_album(tag: &id3::Tag, song_meta_data: &mut Song){
    //ALBUM
    if let Some(album) = tag.album() {
        song_meta_data.album = album.to_owned();
    }
    else{
        song_meta_data.album = String::from("Unknown Album");
    }
}

fn set_album_lofty(audio_file: &lofty::Tag, song_meta_data: &mut Song){
    //ALBUM
    if let Some(album) = lofty::Accessor::album(audio_file) {
        song_meta_data.album = album.to_string();
    }
    else{
        song_meta_data.album = String::from("Unknown Album");
    }
}

fn set_genre(tag: &id3::Tag, song_meta_data: &mut Song){
    //GENRE
    if let Some(genre) = tag.genre() {
        song_meta_data.genre = genre.to_owned();
    }
    else{
        song_meta_data.genre = String::from("Unknown Genre");
    }
}

fn set_genre_lofty(audio_file: &lofty::Tag, song_meta_data: &mut Song){
    //GENRE
    if let Some(genre) = lofty::Accessor::genre(audio_file) {
        song_meta_data.genre = genre.to_string();
    }
    else{
        song_meta_data.genre = String::from("Unknown Genre");
    }
}

fn set_year(tag: &id3::Tag, song_meta_data: &mut Song){
    //YEAR
    if let Some(year) = tag.year() {
        song_meta_data.year = year.to_owned();
    }
    else{
        song_meta_data.year = 0;
    }
}

fn set_year_lofty(audio_file: &lofty::Tag, song_meta_data: &mut Song){
    //YEAR
    if let Some(year) = lofty::Accessor::year(audio_file) {
        song_meta_data.year = year as i32;
    }
    else{
        song_meta_data.year = 0;
    }
}

fn set_duration_bit_rate_sample_rate_bit_depth_channels(path: &str, song_meta_data: &mut Song){
    //DURATION, OVERALL BIT RATE, AUDIO BIT RATE, SAMPLE RATE, BIT DEPTH, CHANNELS
    match Probe::open(path){
        Ok(probed) => {
            match probed.read(){
                Ok(tagged_file) => {
                    song_meta_data.duration_seconds = tagged_file.properties().duration().as_secs();
                    song_meta_data.duration = duration_to_string(&tagged_file.properties().duration().as_secs());
                    song_meta_data.overall_bit_rate = tagged_file.properties().overall_bitrate().unwrap_or(0);
                    song_meta_data.audio_bit_rate = tagged_file.properties().audio_bitrate().unwrap_or(0);
                    song_meta_data.sample_rate = tagged_file.properties().sample_rate().unwrap_or(0);
                    song_meta_data.bit_depth = tagged_file.properties().bit_depth().unwrap_or(0);
                    song_meta_data.channels = tagged_file.properties().channels().unwrap_or(0);
                },
                Err(_) => {
                    song_meta_data.duration_seconds = 0;
                    song_meta_data.duration = String::from("00:00");
                    song_meta_data.overall_bit_rate = 0;
                    song_meta_data.audio_bit_rate = 0;
                    song_meta_data.sample_rate = 0;
                    song_meta_data.bit_depth = 0;
                    song_meta_data.channels = 0;
                },
            }
        },
        Err(_) => {
            song_meta_data.duration_seconds = 0;
            song_meta_data.duration = String::from("00:00");
            song_meta_data.overall_bit_rate = 0;
            song_meta_data.audio_bit_rate = 0;
            song_meta_data.sample_rate = 0;
            song_meta_data.bit_depth = 0;
            song_meta_data.channels = 0;
        },
    }
}

fn set_path(path: &str, song_meta_data: &mut Song){
    //PATH
    song_meta_data.path = path.to_owned();
}

fn set_cover(tag: &id3::Tag, song_meta_data: &mut Song, compress_image_option: &bool){
    //COVER
    if let Some(cover) = tag.pictures().next() {
        let picture_as_num = cover.data.to_owned();
        match compress_image_option {
            true => {
                //we want the image to be compressed to have speed improvements
                //the image resides in picture_as_num as a Vec<u8>
                //compression code goes here
                match resize_and_compress_image(&picture_as_num, &250){
                    Some(compressed_image) => {
                        //we need to convert it to a base64 string
                        song_meta_data.cover = Some(encode_image_in_parallel(&compressed_image));
                    },
                    None => {
                        song_meta_data.cover = Some(encode_image_in_parallel(&picture_as_num));
                    },
                }
            },
            false => {
                //let base64str = general_purpose::STANDARD.encode(&picture_as_num);
                //song_meta_data.cover = Some(base64str);
                song_meta_data.cover = Some(encode_image_in_parallel(&picture_as_num));
            },
        }
        
    }
    else{
        song_meta_data.cover = None;
    }
}

fn set_cover_lofty(tag: &lofty::Tag, song_meta_data: &mut Song, compress_image_option: &bool){
    //COVER
    let pictures = tag.pictures();

    if pictures.len() == 0 {
        song_meta_data.cover = None;
    }
    else{
        for picture in pictures {
            let picture_as_num = picture.data().to_owned();
            match compress_image_option {
                true => {
                    //we want the image to be compressed to have speed improvements
                    //the image resides in picture_as_num as a Vec<u8>
                    //compression code goes here
                    match resize_and_compress_image(&picture_as_num, &250){
                        Some(compressed_image) => {
                            //we need to convert it to a base64 string
                            song_meta_data.cover = Some(encode_image_in_parallel(&compressed_image));
                        },
                        None => {
                            song_meta_data.cover = Some(encode_image_in_parallel(&picture_as_num));
                        },
                    }
                },
                false => {
                    //let base64str = general_purpose::STANDARD.encode(&picture_as_num);
                    //song_meta_data.cover = Some(base64str);
                    song_meta_data.cover = Some(encode_image_in_parallel(&picture_as_num));
                },
            }
            break;
        }
    }

}

fn set_date_recorded(tag: &id3::Tag, song_meta_data: &mut Song){
    //DATE RECORDED
    //"YYYY-MM-DD-HH-MM-SS"
    if let Some(date_recorded) = tag.date_recorded() {
        song_meta_data.date_recorded = date_recorded.year.to_string() + "-";
    }
    else{
        song_meta_data.date_recorded = String::from("Unknown date recorded");
    }
}

fn set_date_recorded_lofty(_audio_file: &lofty::Tag, song_meta_data: &mut Song){
    //needs re-implementation
    //lofty provides no way to access this
    song_meta_data.date_recorded = String::from("Unknown date recorded");
}

fn set_date_released(tag: &id3::Tag, song_meta_data: &mut Song){
    //DATE RELEASED
    //"YYYY-MM-DD-HH-MM-SS"
    if let Some(date_released) = tag.date_released() {
        song_meta_data.date_released = date_released.year.to_string() + "-";
    }
    else{
        song_meta_data.date_released = String::from("Unknown date recorded");
    }
}

fn set_date_released_lofty(_audio_file: &lofty::Tag, song_meta_data: &mut Song){
    //needs re-implementation
    //lofty provides no way to access this
    song_meta_data.date_released = String::from("Unknown date recorded");
}

fn set_file_size(path: &str, song_meta_data: &mut Song){
    //SIZE
    let real_path = Path::new(&path);
    match std::fs::metadata(&real_path) {
        Ok(metadata) => {
            song_meta_data.file_size = metadata.len();
        },
        Err(_) => {
            song_meta_data.file_size = 0;
        },
    }
}

fn set_file_extension(path: &str, song_meta_data: &mut Song){
    //FILE TYPE
    let real_path = Path::new(&path);
    match real_path.extension(){
        Some(wrapped_extension) => {
            match wrapped_extension.to_str(){
                Some(unwrapped_extension) => {
                    song_meta_data.file_type = unwrapped_extension.to_string();
                },
                None => {
                    song_meta_data.file_type = String::from("Unknown file type");
                },
            }
        },
        None => {
            song_meta_data.file_type = String::from("Unknown file type");
        },
    }
}
