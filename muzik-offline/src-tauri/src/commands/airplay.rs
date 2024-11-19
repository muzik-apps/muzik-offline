use std::sync::{Arc, Mutex};
use tauri::State;

use crate::components::airplay::Airplay;
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

fn init_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>) -> Result<(), Box<dyn std::error::Error>>{
    //check if airplay is some
    match airplay.lock(){
        Ok(airplay) => {
            if airplay.child.is_some(){
                return Ok(());
            }
            // if airplay is none, continue
        },
        Err(_) => return Err("Failed to lock airplay".into()),
    }

    let sidecar_command = match app.shell().sidecar("airplay") {
        Ok(sidecar) => sidecar,
        Err(_) => return Err("Failed to get sidecar".into()),
    };

    let (rx, child) = match sidecar_command.spawn(){
        Ok((rx, child)) => (rx, child),
        Err(_) => return Err("Failed to spawn sidecar".into()),
    };

    match airplay.lock(){
        Ok(mut airplay) => {
            airplay.child = Some(child);
            airplay.reviever = Some(rx);
        },
        Err(_) => return Err("Failed to lock airplay".into()),
    }

    Ok(())
}

#[tauri::command]
pub async fn scan_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send scan command
            match airplay_prog.write("scan\n".as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            let res = tauri::async_runtime::spawn(async move {
                match airplay_rv.recv().await {
                    Some(event) => {
                        match event {
                            CommandEvent::Stdout(data) => {
                                let line = String::from_utf8(data).unwrap_or("".to_string());
                                return Ok(line);
                            },
                            CommandEvent::Stderr(data) => {
                                let line = String::from_utf8(data).unwrap_or("".to_string());
                                return Err(line);
                            },
                            _ => return Err("Unexpected event".to_string()),
                        }
                    },
                    None => return Err("Failed to receive event".to_string()),
                }
            });

            match res.await {
                Ok(res) => res,
                Err(e) => return Err(e.to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn connect_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>, device_identification: String) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send connect command
            match airplay_prog.write(format!("connect {}\n", device_identification).as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn pair_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>, device_identification: String) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send pair command
            match airplay_prog.write(format!("pair {}\n", device_identification).as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn enter_pin_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>, pin: String) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send enter pin command
            match airplay_prog.write(format!("{}\n", pin).as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn disconnect_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>, device_identification: String) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send disconnect command
            match airplay_prog.write(format!("disconnect {}\n", device_identification).as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn stream_file_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>, file_path: String) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send stream file command
            match airplay_prog.write(format!("stream {}\n", file_path).as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn resume_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send resume command
            match airplay_prog.write("resume\n".as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn pause_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send pause command
            match airplay_prog.write("pause\n".as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn stop_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send stop command
            match airplay_prog.write("stop\n".as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_rv = match &mut airplay_sidecar.reviever {
                Some(rx) => rx,
                None => return Err("Receiver is none".to_string()),
            };
        
            // expect response
            match airplay_rv.recv() {
                Ok(event) => {
                    match event {
                        CommandEvent::Stdout(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Ok(line);
                        },
                        CommandEvent::Stderr(data) => {
                            let line = String::from_utf8(data).unwrap_or("".to_string());
                            return Err(line);
                        },
                        _ => return Err("Unexpected event".to_string()),
                    }
                },
                Err(_) => return Err("Failed to receive event".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    }
}

#[tauri::command]
pub async fn ctrlc_airplay(app: tauri::AppHandle, airplay: State<'_, Arc<Mutex<Airplay>>>) -> Result<String, String> {
    match init_airplay(app, airplay.clone()){
        Ok(_) => {},
        Err(e) => return Err(e.to_string()),
    }

    match airplay.clone().lock() {
        Ok(mut airplay_sidecar) => {
            let airplay_prog = match &mut airplay_sidecar.child {
                Some(child) => child,
                None => return Err("Child is none".to_string()),
            };
        
            // send ctrlc command
            match airplay_prog.write("\x03".as_bytes()) {
                Ok(_) => {},
                Err(_) => return Err("Failed to send command".to_string()),
            }
        },
        Err(_) => return Err("Failed to lock airplay".to_string()),
    };

    Ok("".to_string())
}