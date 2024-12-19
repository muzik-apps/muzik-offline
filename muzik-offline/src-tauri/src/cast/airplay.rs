use std::sync::Arc;

use tauri::State;

use crate::components::airplay_cast::{AirplayCastCommands, Process};

use super::utils::{assign_process_values, expect_response_from_process, send_command_to_process, send_command_to_process_with_args};

#[tauri::command]
pub async fn airplay_scan(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    println!("airplay_scan");
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    println!("airplay_scan 2");
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process(process.clone(), AirplayCastCommands::AirplayScan).await.map_err(|e| e.to_string())?;
    println!("airplay_scan 3");
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_pair(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, device_identifier: String) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::AirplayPair, device_identifier.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_pin(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, pin: String) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::AirplayPin, pin.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_disconnect(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, device_identifier: String) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::AirplayDisconnect, device_identifier.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_stream_file(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle, file_path: String) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process_with_args(process.clone(), AirplayCastCommands::AirplayStream, file_path.as_str()).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_resume(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process(process.clone(), AirplayCastCommands::AirplayResume).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_pause(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process(process.clone(), AirplayCastCommands::AirplayPause).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}

#[tauri::command]
pub async fn airplay_stop(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process(process.clone(), AirplayCastCommands::AirplayStop).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}