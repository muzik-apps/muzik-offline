use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, MediaPlayback, PlatformConfig};
use tauri::{State, Runtime};
use std::sync::Mutex;
use crate::components::audio_manager::SharedAudioManager;

#[tauri::command]
pub fn config_mca<R: Runtime>(audio_manager: State<'_, Mutex<SharedAudioManager>>, window: &tauri::Window<R>){
    match audio_manager.lock(){
        Ok(mut manager) => {
            #[cfg(not(target_os = "windows"))]
            let hwnd: Option<*mut c_void> = None;
        
            #[cfg(target_os = "windows")]
            let hwnd: Option<*mut std::ffi::c_void> = {
                let pointer = Box::new(window);
                Some(Box::into_raw(pointer) as *mut std::ffi::c_void)
            };
        
            let config = PlatformConfig {
                dbus_name: "muzik-offline",
                display_name: "muzik-offline",
                hwnd,
            };
        
            let controls = {
                match MediaControls::new(config){
                    Ok(cntrl) =>{
                        cntrl
                    }
                    Err(_) => {
                        return;
                    }
                }};
        
            manager.controls = Some(controls);
        }
        ,
        Err(_) => {
            //failed to lock audio manager
        },
    }
}

#[tauri::command]
pub fn update_metadata(audio_manager: State<'_, Mutex<SharedAudioManager>>, title: &str, artist: &str, album: &str){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.controls{
                Some(controller) => {
                    match controller.set_metadata(MediaMetadata {
                        title: Some(title),
                        artist: Some(artist),
                        album: Some(album),
                        ..Default::default()
                    }){
                        Ok(_) => {
        
                        }
                        Err(_) => {
        
                        }
                    }
                },
                None => {
        
                },
            }
        },
        Err(_) => {

        },
    }
}

#[tauri::command]
pub fn update_playback(audio_manager: State<'_, Mutex<SharedAudioManager>>, playback: MediaPlayback){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.controls{
                Some(controller) => {
                    match controller.set_playback(playback){
                        Ok(_) => {
        
                        }
                        Err(_) => {
        
                        }
                    }
                },
                None => {
        
                },
            }
        },
        Err(_) => {

        },
    }
}

#[tauri::command]
pub fn attach_event<R: Runtime>(audio_manager: State<'_, Mutex<SharedAudioManager>>, window: &tauri::Window<R>){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.controls{
                Some(controller) => {
                    match controller.attach(|event: MediaControlEvent| {
                        if event == MediaControlEvent::Play{
                        }
                    }){
                        Ok(_) => {
        
                        }
                        Err(_) => {
        
                        }
                    }
                },
                None => {
        
                },
            }
        },
        Err(_) => {
    
        },
    }
}

#[tauri::command]
pub fn detach_event(audio_manager: State<'_, Mutex<SharedAudioManager>>){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.controls{
                Some(controller) => {
                    match controller.detach(){
                        Ok(_) => {
        
                        }
                        Err(_) => {
        
                        }
                    }
                },
                None => {
        
                },
            }
        },
        Err(_) => {
    
        },
    }
}

#[tauri::command]
pub fn send_request_to_window<R: Runtime>(window: &tauri::Window<R>){
    
}
//else if event == MediaControlEvent::Pause{
//    
//}
//else if event == MediaControlEvent::Next{
//    
//}
//else if event == MediaControlEvent::Previous{
//    
//}
//else if event == MediaControlEvent::Stop{
//    
//}