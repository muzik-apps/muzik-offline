use std::sync::{Arc, Mutex};

use tauri::State;

use crate::components::airplay_cast::{airplay_cast_commands_as_string, AirplayCastCommands, Process};

use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

fn assign_process_values(process: State<'_, Arc<Mutex<Process>>>, app: tauri::AppHandle) -> Result<(), String> {
  match process.lock() {
    Ok(mut process) => {
      if process.child.is_none() && process.receiver.is_none() {
        let sidecar_command = app.shell().sidecar("my-sidecar").map_err(|e| e.to_string())?;
        let (rx, child) = sidecar_command
          .spawn()
          .map_err(|e| e.to_string())?;

        process.child = Some(child);
        process.receiver = Some(rx);
      }
    }
    Err(e) => {
      eprintln!("Error assigning process values: {:?}", e);
    }
  }
  Ok(())
}

#[tauri::command]
pub async fn airplay_scan(process: State<'_, Arc<Mutex<Process>>>, app: tauri::AppHandle) -> Result<String, String> {
  // this assigns the process values if they are none otherwise an error is returned
  assign_process_values(process.clone(), app).map_err(|e| e.to_string())?;

  // we can be sure at this point that the child and receiver are not None even if rust is saying they are None
  match process.lock() {
    Ok(mut process) => {
      let child = match process.child.as_mut() {
        Some(child) => child,
        None => return Err("Child process is None".to_string()) // this WILL NOT be reached
      };
      child.write(format!("{}\n", airplay_cast_commands_as_string(AirplayCastCommands::AirplayScan)).as_bytes()).map_err(|e| e.to_string())?;

      let receiver = match process.receiver.as_mut() {
        Some(receiver) => receiver,
        None => return Err("Receiver is None".to_string()) // this WILL NOT be reached
      };

      match receiver.recv().await {
        Some(event) => {
          match event {
            CommandEvent::Stdout(data) => {
              return Ok(String::from_utf8_lossy(&data).to_string());
            }
            CommandEvent::Stderr(data) => {
              return Err(String::from_utf8_lossy(&data).to_string());
            }
            _ => {
              return Err("Unknown event".to_string());
            }
          }
        }
        None => {
          return Err("No event received".to_string());
        }
      }
    }
    Err(e) => {
      return Err(format!("Error locking process: {:?}", e));
    }
  }
}