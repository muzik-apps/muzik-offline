use std::process::Command;
use dirs::audio_dir;
use crate::utils::general_utils::{resize_and_compress_image, encode_image_in_parallel, decode_image_in_parallel};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//#[tauri::command]
//pub fn greet(name: &str) -> String {
//    format!("Hello, {}! You've been greeted from Rust!", name)
//    //this serves as an example template whenever new commands are to be created
//    //so don't delete this
//}

#[tauri::command]
pub fn open_in_file_manager(file_path: &str) {
    open_file_at(&file_path);
}

#[tauri::command]
pub async fn resize_frontend_image_to_fixed_height(image_as_str: String, height: u32) -> Result<String, String> {
    match decode_image_in_parallel(&image_as_str){
        Ok(image) => {
            match resize_and_compress_image(&image, &height as &u32){
                Some(resized_image) => {
                    Ok(encode_image_in_parallel(&resized_image))
                },
                None => {
                    Err(String::from("FAILED"))
                },
            }
        },
        Err(_) => {
            Err(String::from("FAILED"))
        },
    }
}

#[tauri::command]
pub fn get_audio_dir() -> String{
    //get the audio path
    match audio_dir() {
        Some(path) => {
            match path.to_str(){
                Some(path) => {
                    //inserting this path won't have an effect if it already exists
                    return String::from(path);
                },
                None => {
                    return String::from("");
                }
            }
        },
        None => {
            return String::from("");
        }
    }
}

#[cfg(target_os = "macos")]
fn open_file_at(file_path: &str) {
    match Command::new( "open" )
        .arg("-R")
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {

        },
        Err(_) => {
            
        },
    }
}

#[cfg(target_os = "windows")]
fn open_file_at(file_path: &str) {
    match Command::new( "explorer" )
        .arg("/select,")
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {

        },
        Err(_) => {

        },
    }
}

#[cfg(target_os = "linux")]
fn open_file_at(file_path: &str) {
    match Command::new( "xdg-open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {

        },
        Err(_) => {

        },
    }
}
