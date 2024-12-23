use crate::components::{rodio_audio_manager::RodioManager, kira_audio_manager::KiraManager};
use std::sync::{Arc, Mutex};
use tauri::State;

use super::{
    kira_player::{
        get_song_position_kira, load_a_song_from_path_kira, load_and_play_song_from_path_kira, 
        pause_song_kira, resume_playing_kira, seek_by_kira, seek_to_kira, set_playback_speed_kira, 
        set_volume_kira, stop_song_kira
    }, 
    rodio_player::{
        get_song_position_rodio, load_a_song_from_path_rodio, load_and_play_song_from_path_rodio, 
        pause_song_rodio, resume_playing_rodio, seek_by_rodio, seek_to_rodio, set_volume_rodio, 
        stop_song_rodio, set_playback_speed_rodio
    }};

#[tauri::command]
pub fn get_available_audio_backends(rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>, kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>) -> Vec<String> {
    let mut backends = vec![];
    match rodio_audio_manager.lock(){
        Ok(_) => {
            backends.push("rodio".to_string());
        }
        Err(_) => {}
    }
    match kira_audio_manager.lock(){
        Ok(kira) => {
            if kira.is_some(){
                backends.push("kira".to_string());
            }
        }
        Err(_) => {}
    }
    backends
}

#[tauri::command]
pub fn load_and_play_song_from_path(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    sound_path: &str,
    player: &str,
    volume: f64,
    duration: f64,
    play_back_speed: f32,
    fade_in_out: bool,
) {
    match player{
        "rodio" => {
            load_and_play_song_from_path_rodio(rodio_audio_manager, sound_path, volume, duration, play_back_speed, fade_in_out);
        }
        "kira" => {
            load_and_play_song_from_path_kira(kira_audio_manager, sound_path, volume, duration, play_back_speed, fade_in_out);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
}

#[tauri::command]
pub fn load_a_song_from_path(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    sound_path: &str,
    player: &str,
    volume: f64,
    duration: f64,
    play_back_speed: f32,
    fade_in_out: bool,
) {
    match player{
        "rodio" => {
            load_a_song_from_path_rodio(rodio_audio_manager, sound_path, volume, duration, play_back_speed, fade_in_out);
        }
        "kira" => {
            load_a_song_from_path_kira(kira_audio_manager, sound_path, volume, duration, play_back_speed, fade_in_out);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
}

#[tauri::command]
pub fn pause_song(rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>, kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>, player: &str) {
    match player{
        "rodio" => {
            pause_song_rodio(rodio_audio_manager);
        }
        "kira" => {
            pause_song_kira(kira_audio_manager);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
    
}

#[tauri::command]
pub fn stop_song(rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>, kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>, player: &str) {
    match player{
        "rodio" => {
            stop_song_rodio(rodio_audio_manager);
        }
        "kira" => {
            stop_song_kira(kira_audio_manager);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
    
}

#[tauri::command]
pub fn resume_playing(rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>, kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>, player: &str) {
    match player{
        "rodio" => {
            resume_playing_rodio(rodio_audio_manager);
        }
        "kira" => {
            resume_playing_kira(kira_audio_manager);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
    
}

#[tauri::command]
pub fn seek_to(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    player: &str,
    position: f64
) {
    match player{
        "rodio" => {
            seek_to_rodio(rodio_audio_manager, position);
        }
        "kira" => {
            seek_to_kira(kira_audio_manager, position);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
}

#[tauri::command]
pub fn seek_by(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    player: &str,
    delta: f64
) {
    match player{
        "rodio" => {
            seek_by_rodio(rodio_audio_manager, delta);
        }
        "kira" => {
            seek_by_kira(kira_audio_manager, delta);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
}

#[tauri::command]
pub fn get_song_position(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    player: &str
) -> f64 {
    match player{
        "rodio" => {
            get_song_position_rodio(rodio_audio_manager)
        }
        "kira" => {
            get_song_position_kira(kira_audio_manager)
        }
        _ => {
            // Handle the case where the player is not recognized
            0.0
        }
    }
}

#[tauri::command]
pub fn set_volume(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    player: &str,
    volume: f64
) {
    match player{
        "rodio" => {
            set_volume_rodio(rodio_audio_manager, volume);
        }
        "kira" => {
            set_volume_kira(kira_audio_manager, volume);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
}

#[tauri::command]
pub fn set_playback_speed(
    rodio_audio_manager: State<'_, Arc<Mutex<RodioManager>>>,
    kira_audio_manager: State<'_, Arc<Mutex<Option<KiraManager>>>>,
    player: &str,
    speed: f32
) {
    match player{
        "rodio" => {
            set_playback_speed_rodio(rodio_audio_manager, speed);
        }
        "kira" => {
            set_playback_speed_kira(kira_audio_manager, speed as f64);
        }
        _ => {
            // Handle the case where the player is not recognized
        }
    }
}