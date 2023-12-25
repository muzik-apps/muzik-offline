use std::sync::Mutex;
use tauri::State;
use kira::{
	sound::streaming::{StreamingSoundData, StreamingSoundSettings}, tween::Tween
};

use crate::components::SharedAudioManager;

#[tauri::command]
pub fn play_sound(audio_manager: State<'_, Mutex<SharedAudioManager>>, sound_path: &str) -> Result<String, String> {
    match audio_manager.lock(){
        Ok(mut manager) => {
            match StreamingSoundData::from_file(sound_path, StreamingSoundSettings::default()){
                Ok(sound_data) => {
                    match manager.manager.play(sound_data){
                        Ok(_) => {
                            Ok(format!("Started playing song at path: {}", sound_path))
                        },
                        Err(_) => {
                            Err(format!("Failed to play song at path: {}", sound_path))
                        },
                    }
                },
                Err(_) => {
                    Err(format!("Failed to load song at path: {}", sound_path))
                },
            }
        },
        Err(_) => {
            Err("Failed to lock audio manager as the player is busy now".into())
        },
    }
}

#[tauri::command]
pub fn pause_sound(audio_manager: State<'_, Mutex<SharedAudioManager>>) -> Result<String, String> {
    match audio_manager.lock(){
        Ok(manager) => {
            match manager.manager.pause(Tween::default()){
                Ok(_) => {
                    Ok("Paused the current song".into())
                },
                Err(_) => {
                    Err("Failed to pause the current song".into())
                },
            }
        },
        Err(_) => {
            Err("Failed to lock audio manager as the player is busy now".into())
        },
    }
}

#[tauri::command]
pub fn resume_playing(audio_manager: State<'_, Mutex<SharedAudioManager>>) -> Result<String, String> {
    match audio_manager.lock(){
        Ok(manager) => {
            match manager.manager.resume(Tween::default()){
                Ok(_) => {
                    Ok("Resumed the current song".into())
                },
                Err(_) => {
                    Err("Failed to resume the current song".into())
                },
            }
        },
        Err(_) => {
            Err("Failed to lock audio manager as the player is busy now".into())
        },
    }
}