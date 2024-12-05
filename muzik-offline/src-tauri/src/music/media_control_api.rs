use std::{
    sync::{Arc, Mutex},
    time::Duration,
};

use crate::{
    components::{audio_manager::AppAudioManager, event_payload::Payload},
    database::{db_api::get_song_from_tree, db_manager::DbManager}
};

use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, MediaPlayback, PlatformConfig};

use tauri::{AppHandle, Emitter, State};

pub fn config_mca() -> Option<MediaControls> {
    #[cfg(not(target_os = "windows"))]
    let hwnd: Option<*mut std::ffi::c_void> = None;

    // map(|handle| handle as *mut std::os::raw::c_void)
    #[cfg(target_os = "windows")]
    let hwnd = {
        use crate::windows::window;
        let window = match window::windows::Window::new() {
            Ok(window) => window,
            Err(err) => {
                println!("Failed to create dummy window: {:?}", err);
                return None;
            }
        };
        Some(window)
    };

    let config = PlatformConfig {
        dbus_name: "muzik-offline",
        display_name: "muzik-offline",
        hwnd,
    };

    match MediaControls::new(config) {
        Ok(cntrl) => {
            return Some(cntrl);
        }
        Err(err) => {
            println!("Failed to initialize media controls: {:?}", err);
            return None;
        }
    };
}

pub fn configure_media_controls(controls: &mut MediaControls, cover_url: &str) {
    match controls.set_metadata(MediaMetadata {
        title: Some("No song is playing"),
        artist: Some("No artist"),
        album: Some("No album"),
        cover_url: Some(cover_url),
        duration: None,
    }) {
        Ok(_) => {}
        Err(_) => {}
    }
}

pub fn event_handler(app: &AppHandle, event: &MediaControlEvent) {
    match event {
        MediaControlEvent::Play => {
            // emit play event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Play, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Pause => {
            // emit pause event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Pause, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Next => {
            // emit next event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Next, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Previous => {
            // emit previous event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Previous, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Stop => {
            // emit stop event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Stop, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Seek(sd) => {
            // emit seek event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Seek(*sd), Some(*sd), None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::SeekBy(sd, duration) => {
            // emit seek by event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(
                    MediaControlEvent::SeekBy(*sd, *duration),
                    Some(*sd),
                    Some(duration.as_secs()),
                    None,
                    None,
                ),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::SetPosition(mp) => {
            // emit set position event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(
                    MediaControlEvent::SetPosition(*mp),
                    None,
                    Some(mp.0.as_secs()),
                    None,
                    None,
                ),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::SetVolume(volume) => {
            // emit set volume event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(
                    MediaControlEvent::SetVolume(*volume),
                    None,
                    None,
                    Some(*volume),
                    None,
                ),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::OpenUri(uri) => {
            // emit open uri event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(
                    MediaControlEvent::OpenUri(uri.clone()),
                    None,
                    None,
                    None,
                    Some(uri.clone()),
                ),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Raise => {
            // emit raise event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Raise, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        MediaControlEvent::Quit => {
            // emit quit event to window but don't crash/expect error if it fails we will just ignore the event request
            match app.emit(
                "os-media-controls",
                Payload::new(MediaControlEvent::Quit, None, None, None, None),
            ) {
                Ok(_) => {}
                Err(_) => {}
            }
        }
        _ => {}
    }
}

#[tauri::command]
pub fn update_metadata(
    audio_manager: State<'_, Arc<Mutex<AppAudioManager>>>,
    db_manager: State<'_, Arc<Mutex<DbManager>>>,
    uuid: String,
) {
    let song = match get_song_from_tree(db_manager.clone(), &uuid) {
        Some(song) => song,
        None => return,
    };

    match audio_manager.lock() {
        Ok(mut manager) => {
            let port = manager.port.clone();
            match &mut manager.controls {
                Some(controller) => {
                    match controller.set_metadata(MediaMetadata {
                        title: Some(&song.name),
                        artist: Some(&song.artist),
                        album: Some(&song.album),
                        duration: Some(Duration::from_secs(song.duration_seconds)),
                        cover_url: Some(&format!("http://localhost:{}/covers/{}", port, uuid)),
                    }) {
                        Ok(_) => {}
                        Err(_) => {}
                    }
                }
                None => {}
            }
        }
        Err(_) => {}
    }
}

#[tauri::command]
pub fn set_player_state(audio_manager: State<'_, Arc<Mutex<AppAudioManager>>>, state: &str) {
    //,position: f64
    match audio_manager.lock() {
        Ok(mut manager) => {
            let cover_url = manager.cover_url.clone();
            match &mut manager.controls {
                Some(controller) => {
                    match state {
                        "playing" => {
                            match controller.set_playback(MediaPlayback::Playing { progress: None })
                            {
                                //Some(MediaPosition(Duration::from_secs_f64(position)))}){
                                Ok(_) => {}
                                Err(_) => {}
                            }
                        }
                        "paused" => {
                            match controller.set_playback(MediaPlayback::Paused { progress: None })
                            {
                                //Some(MediaPosition(Duration::from_secs_f64(position)))}){
                                Ok(_) => {}
                                Err(_) => {}
                            }
                        }
                        "stopped" => match controller.set_playback(MediaPlayback::Stopped) {
                            Ok(_) => {
                                configure_media_controls(controller, &cover_url);
                            }
                            Err(_) => {}
                        },
                        _ => {}
                    }
                }
                None => {}
            }
        }
        Err(_) => {}
    }
}
