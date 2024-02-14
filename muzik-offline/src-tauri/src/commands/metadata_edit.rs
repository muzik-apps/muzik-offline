use id3::{frame::Picture, Content, Frame, Tag, TagLike, Timestamp};

use crate::{components::song::Song, utils::general_utils::decode_image_in_parallel};

#[tauri::command]
pub fn edit_song_metadata(song_path: String, song_metadata: String) -> Result<String, String>{
    //convert song_metadata to Song using serde_json
    match serde_json::from_str(&song_metadata){
        Ok(song) => {
            match edit_metadata(song_path, song){
                Ok(_) => {
                    Ok(format!("Metadata edited successfully"))
                }
                Err(err) => {
                    Err(format!("Error editing metadata: {}", err))
                }
            }
        }
        Err(err) => {
            Err(format!("Error parsing song metadata: {}", err))
        }
    }
}

fn edit_metadata(song_path: String, song: Song) -> Result<(), Box<dyn std::error::Error>>{
    let mut tag = Tag::read_from_path(song_path)?;
    tag.set_title(song.title.clone());
    tag.set_artist(song.artist.clone());
    tag.set_album(song.album.clone());
    tag.set_genre(song.genre.clone());
    tag.set_year(song.year);
    tag.set_date_recorded(create_timestamp(&song.date_recorded));
    tag.set_date_released(create_timestamp(&song.date_released));
    tag.add_frame(create_frame(&song));
    Ok(())
}

fn create_timestamp(date_a: &String) -> Timestamp{
    let date: Vec<&str> = date_a.split("-").collect();
    let year = get_year(&date);
    let month = get_month(&date);
    let day = get_day(&date);
    let hour = get_hour(&date);
    let minute = get_minute(&date);
    let second = get_second(&date);

    Timestamp{ 
        year, month, day, hour, minute, second 
    }
}

fn get_year(date: &Vec<&str>) -> i32 {
    match date.get(0){
        Some(value) => {
            match value.parse::<i32>(){
                Ok(year_val) => {
                    year_val
                }
                Err(_) =>{
                    0
                }
            }
        }
        None => {
            0
        }
    }
}

fn get_month(date: &Vec<&str>) -> Option<u8>{
    match date.get(1){
        Some(value) => {
            match value.parse::<u8>(){
                Ok(year_val) => {
                    Some(year_val)
                }
                Err(_) =>{
                    Some(0)
                }
            }
        }
        None => {
            Some(0)
        }
    } 
}

fn get_day(date: &Vec<&str>) -> Option<u8>{
    match date.get(2){
        Some(value) => {
            match value.parse::<u8>(){
                Ok(year_val) => {
                    Some(year_val)
                }
                Err(_) =>{
                    Some(0)
                }
            }
        }
        None => {
            Some(0)
        }
    } 
}

fn get_hour(date: &Vec<&str>) -> Option<u8>{
    match date.get(1){
        Some(value) => {
            match value.parse::<u8>(){
                Ok(year_val) => {
                    Some(year_val)
                }
                Err(_) =>{
                    Some(0)
                }
            }
        }
        None => {
            Some(0)
        }
    } 
}

fn get_minute(date: &Vec<&str>) -> Option<u8>{
    match date.get(1){
        Some(value) => {
            match value.parse::<u8>(){
                Ok(year_val) => {
                    Some(year_val)
                }
                Err(_) =>{
                    Some(0)
                }
            }
        }
        None => {
            Some(0)
        }
    } 
}

fn get_second(date: &Vec<&str>) -> Option<u8>{
    match date.get(1){
        Some(value) => {
            match value.parse::<u8>(){
                Ok(year_val) => {
                    Some(year_val)
                }
                Err(_) =>{
                    Some(0)
                }
            }
        }
        None => {
            Some(0)
        }
    } 
}

fn create_frame(song: &Song) -> Frame{
    let frame = Frame::with_content(
        "TXXX", 
        Content::Picture(
            Picture{
                mime_type: "image/jpeg".to_string(),
                picture_type: id3::frame::PictureType::CoverFront,
                description: "Cover".to_string(),
                data: get_cover_as_vec(&song.cover)
            }
        ));
    frame
}

fn get_cover_as_vec(cover: &Option<String>) -> Vec<u8>{
    match cover{
        Some(cover_as_str) => {
            match decode_image_in_parallel(cover_as_str){
                Ok(cover_as_vec) => {
                    cover_as_vec
                }
                Err(_) => {
                    Vec::new()
                }
            }
        }
        None => {
            Vec::new()
        }
    }
}
