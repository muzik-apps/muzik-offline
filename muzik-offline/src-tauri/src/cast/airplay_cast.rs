use std::sync::Arc;

use tauri::State;

use crate::components::airplay_cast::{airplay_cast_commands_as_string, AirplayCastCommands, Process};

use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

async fn assign_process_values(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<(), String> {
  let mut lock = process.lock().await;

  if lock.child.is_none() && lock.receiver.is_none() {
    let sidecar_command = app.shell().sidecar("airplay_cast").map_err(|e| e.to_string())?;
    let (rx, child) = sidecar_command
      .spawn()
      .map_err(|e| e.to_string())?;

    lock.child = Some(child);
    lock.receiver = Some(rx);
  }

  Ok(())
}

async fn send_command_to_process(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, command: AirplayCastCommands) -> Result<(), String> {
  let mut lock = process.lock().await;

  if let Some(child) = lock.child.as_mut() {
    child.write(format!("{}\n", airplay_cast_commands_as_string(command)).as_bytes()).map_err(|e| e.to_string())?;
  } else {
    return Err("Child process is None".to_string());
  }

  Ok(())
}

async fn send_command_to_process_with_args(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, command: AirplayCastCommands, args: &str) -> Result<(), String> {
  let mut lock = process.lock().await;

  if let Some(child) = lock.child.as_mut() {
    child.write(format!("{} {}\n", airplay_cast_commands_as_string(command), args).as_bytes()).map_err(|e| e.to_string())?;
  } else {
    return Err("Child process is None".to_string());
  }

  Ok(())
}

async fn expect_response_from_process(process: State<'_, Arc<tokio::sync::Mutex<Process>>>) -> Result<String, String> {
  let mut lock = process.lock().await;

  if let Some(receiver) = lock.receiver.as_mut() {
    if let Some(event) = receiver.recv().await {
      match event {
        CommandEvent::Stdout(data) => {
          let res = String::from_utf8_lossy(&data).to_string();
          // remove "Enter command: " from the response
          return Ok(res.replace("Enter command: ", ""));
        }
        CommandEvent::Stderr(data) => {
          let res = String::from_utf8_lossy(&data).to_string();
          // remove "Enter command: " from the response
          return Err(res.replace("Enter command: ", ""));
        }
        _ => {
          return Err("Unknown event".to_string());
        }
      }
    } else {
      return Err("No event received".to_string());
    }
  } else {
    return Err("Receiver is None".to_string());
  }
}

#[tauri::command]
pub async fn airplay_scan(process: State<'_, Arc<tokio::sync::Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
  // this assigns the process values if they are none otherwise an error is returned
  assign_process_values(process.clone(), app).await.map_err(|e| e.to_string())?;

  // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
  send_command_to_process(process.clone(), AirplayCastCommands::AirplayScan).await.map_err(|e| e.to_string())?;
  expect_response_from_process(process.clone()).await
}