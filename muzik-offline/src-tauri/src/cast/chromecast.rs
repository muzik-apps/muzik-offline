use std::sync::Arc;

use tauri::State;

use crate::components::airplay_cast::{AirplayCastCommands, Process};

use super::utils::{assign_process_values, send_command_to_process, expect_response_from_process};

#[tauri::command]
pub async fn chromecast_scan(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
    // this assigns the process values if they are none otherwise an error is returned
    assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;
    
    // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
    send_command_to_process(process.clone(), AirplayCastCommands::ChromecastScan).await.map_err(|e| e.to_string())?;
    expect_response_from_process(process.clone()).await
}