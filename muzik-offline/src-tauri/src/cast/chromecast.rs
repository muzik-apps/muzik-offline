use std::sync::Arc;

use tauri::State;

use crate::components::airplay_cast::{AirplayCastCommands, Process};

use super::utils::{assign_process_values, expect_response_from_process, send_command_to_process, send_command_to_process_with_args};

#[tauri::command]
pub async fn chromecast_scan(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process(process.clone(), AirplayCastCommands::ChromecastScan).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn chromecast_stream(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, devices: Vec<String>, file_path: String) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    // command = "stream <file_path> [id1, id2, id3, ..., idn]". The ids are the device identifiers
    let command = format!("{} [{}]", file_path, devices.join(","));
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::ChromecastStream, command.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn chromecast_resume(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, devices: Vec<String>) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    // command = "resume [id1, id2, id3, ..., idn]". The ids are the device identifiers
    let command = format!("[{}]", devices.join(","));
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::ChromecastResume, command.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn chromecast_pause(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, devices: Vec<String>) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    // command = "pause [id1, id2, id3, ..., idn]". The ids are the device identifiers
    let command = format!("[{}]", devices.join(","));
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::ChromecastPause, command.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn chromecast_stop(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, devices: Vec<String>) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    // command = "stop [id1, id2, id3, ..., idn]". The ids are the device identifiers
    let command = format!("[{}]", devices.join(","));
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::ChromecastStop, command.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}