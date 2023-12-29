use std::process::Command;
use crate::utils::general_utils::resize_and_compress_image;
use base64::{Engine as _, engine::general_purpose};

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
    match general_purpose::STANDARD.decode(image_as_str){
        Ok(image) => {
            match resize_and_compress_image(&image, &height as &u32){
                Some(resized_image) => {
                    Ok(general_purpose::STANDARD.encode(&resized_image))
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

#[cfg(target_os = "macos")]
fn open_file_at(file_path: &str) {
    match Command::new( "open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}

#[cfg(target_os = "windows")]
fn open_file_at(file_path: &str) {
    match Command::new( "explorer" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}

#[cfg(target_os = "linux")]
fn open_file_at(file_path: &str) {
    match Command::new( "xdg-open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}