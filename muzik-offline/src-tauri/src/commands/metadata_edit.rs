use id3::{Content, Frame, TagLike, Timestamp};
use lofty::TaggedFileExt;
use lofty::Accessor;

use crate::{components::song::Song, utils::general_utils::decode_image_in_parallel};
use crate::database::db_api::insert_song_into_tree;

#[tauri::command]
pub fn edit_song_metadata(song_path: String, song_metadata: String, has_changed_cover: bool) -> Result<String, String>{
    //convert song_metadata to Song using serde_json
    match serde_json::from_str::<Song>(&song_metadata){
        Ok(song) => {
            if let Ok(()) = edit_metadata_id3(&song_path, &song, &has_changed_cover){
                match insert_song_into_tree(song) {
                    Ok(_) => {
                        Ok(format!("Metadata edited successfully"))
                    }
                    Err(_) => {
                        Err(format!("Error saving song edits"))
                    }
                }
            }
            else if let Ok(()) = edit_metadata_lofty(&song_path, &song){
                match insert_song_into_tree(song) {
                    Ok(_) => {
                        Ok(format!("Metadata edited successfully"))
                    }
                    Err(_) => {
                        Err(format!("Error saving song edits"))
                    }
                }
            }
            else{
                Err(format!("Error editing metadata"))
            }
        }
        Err(_) => {
            Err(format!("Error parsing song metadata"))
        }
    }
}

fn edit_metadata_lofty(song_path: &String, song: &Song) -> Result<(), Box<dyn std::error::Error>>{
    let mut tagged_file = lofty::read_from_path(song_path)?;

    match tagged_file.first_tag_mut(){
        Some(tag) => {
            set_title_lofty(tag, &song);
            set_artist_lofty(tag, &song);
            set_album_lofty(tag, &song);
            set_genre_lofty(tag, &song);
            set_year_lofty(tag, &song);
        }
        None => {
            return Err("Error opening file".into());
        }
    }

    Ok(())
}

fn edit_metadata_id3(song_path: &String, song: &Song, has_changed_cover: &bool) -> Result<(), Box<dyn std::error::Error>>{
    let mut tag = id3::Tag::read_from_path(song_path)?;
    set_title_id3(&mut tag, song);
    set_artist_id3(&mut tag, song);
    set_album_id3(&mut tag, song);
    if *has_changed_cover == true {
        set_cover_id3(&mut tag, song);
    }
    set_genre_id3(&mut tag, song);
    set_year_id3(&mut tag, song);
    tag.set_date_recorded(create_timestamp(&song.date_recorded));
    tag.set_date_released(create_timestamp(&song.date_released));
    Ok(())
}

fn create_timestamp(date_a: &String) -> Timestamp{
    //account for the fct that we might have "Unknown date recorded" or "Unknown date released"
    if date_a == "Unknown date recorded" || date_a == "Unknown date released"{
        return Timestamp{ 
            year: 0, month: Some(0), day: Some(0), hour: Some(0), minute: Some(0), second: Some(0) 
        }
    }
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



// check if values have changed then if they have, edit and save the changes
fn set_title_id3(tag: &mut id3::Tag, song_meta_data: &Song){
    //TITLE
    if let Some(title) = tag.title(){
        if song_meta_data.title != title {
            tag.set_title(song_meta_data.title.clone())
        }
    }
}

fn set_title_lofty(tag: &mut lofty::Tag , song_meta_data: &Song){
    //TITLE
    if let Some(title) = tag.title() {
        if song_meta_data.title != title {
            tag.set_title(song_meta_data.title.clone())
        }
    }
}

fn set_artist_id3(tag: &mut id3::Tag, song_meta_data: &Song){
    //ARTIST
    if let Some(artist) = tag.artist() {
        if song_meta_data.artist != artist{
            tag.set_artist(song_meta_data.artist.clone());
        }
    }
}

fn set_artist_lofty(tag: &mut lofty::Tag, song_meta_data: &Song){
    //ARTIST
    if let Some(artist) = tag.artist() {
        if song_meta_data.artist != artist{
            tag.set_artist(song_meta_data.artist.clone());
        }
    }
}

fn set_album_id3(tag: &mut id3::Tag, song_meta_data: &Song){
    //ALBUM
    if let Some(album) = tag.album() {
        if song_meta_data.album != album{
            tag.set_album(song_meta_data.album.clone());
        }
    }
}

fn set_album_lofty(tag: &mut lofty::Tag, song_meta_data: &Song){
    //ALBUM
    if let Some(album) = tag.album() {
        if song_meta_data.album != album{
            tag.set_album(song_meta_data.album.clone());
        }
    }
}

fn set_genre_id3(tag: &mut id3::Tag, song_meta_data: &Song){
    //GENRE
    if let Some(genre) = tag.genre() {
        if song_meta_data.genre != genre{
            tag.set_genre(song_meta_data.genre.clone());
        }
    }
}

fn set_genre_lofty(tag: &mut lofty::Tag, song_meta_data: &Song){
    //GENRE
    if let Some(genre) = tag.genre() {
        if song_meta_data.genre != genre{
            tag.set_genre(song_meta_data.genre.clone());
        }
    }
}

fn set_year_id3(tag: &mut id3::Tag, song_meta_data: &Song){
    //YEAR
    if let Some(year) = tag.year() {
        if song_meta_data.year as i32 != year{
            tag.set_year(song_meta_data.year as i32);
        }
    }
}

fn set_year_lofty(tag: &mut lofty::Tag, song_meta_data: &Song){
    //YEAR
    if let Some(year) = tag.year() {
        if song_meta_data.year != year{
            tag.set_year(song_meta_data.year);
        }
    }
}

fn set_cover_id3(tag: &mut id3::Tag, song_meta_data: &Song){
    //COVER
    if let Some(cover) = &song_meta_data.cover{
        match decode_image_in_parallel(cover){
            Ok(cover_as_vec) => {
                tag.add_frame(Frame::with_content("APIC", Content::Picture(
                    id3::frame::Picture{
                        mime_type: "image/jpeg".to_string(),
                        picture_type: id3::frame::PictureType::CoverFront,
                        description: "Cover".to_string(),
                        data: cover_as_vec
                })));
            }
            Err(_) => {
                //do nothing
            }
        }
    }
}
