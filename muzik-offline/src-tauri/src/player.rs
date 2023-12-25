use std::sync::Mutex;
use tauri::State;
use kira::{
	sound::streaming::{StreamingSoundData, StreamingSoundSettings}, tween::Tween
};

use crate::components::SharedAudioManager;

#[tauri::command]
pub fn load_and_play_song_from_path(audio_manager: State<'_, Mutex<SharedAudioManager>>, sound_path: &str){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match StreamingSoundData::from_file(sound_path, StreamingSoundSettings::default()){
                Ok(sound_data) => {
                    match manager.manager.play(sound_data){
                        Ok(instance_handle) => {
                            //playback started
                            manager.instance_handle = Some(instance_handle);
                        },
                        Err(_) => {
                            //playback failed
                        },
                    }
                },
                Err(_) => {
                    //failed to load sound
                },
            }
        },
        Err(_) => {
            //failed to lock audio manager
        },
    }
}

#[tauri::command]
pub fn pause_song(audio_manager: State<'_, Mutex<SharedAudioManager>>) {
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.pause(Tween::default()){
                        Ok(_) => {
                            //paused song
                        },
                        Err(_) => {
                            //failed to pause song
                        },
                    }
                },
                None => {
                    //no song is currently playing
                },
            }
        },
        Err(_) => {
            //failed to lock audio manager
        },
    }
}

#[tauri::command]
pub fn resume_playing(audio_manager: State<'_, Mutex<SharedAudioManager>>){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.resume(Tween::default()){
                        Ok(_) => {
                            //resumed song
                        },
                        Err(_) => {
                            //failed to resume song
                        },
                    }
                },
                None => {
                    //no song is currently paused or playing
                },
            }
        },
        Err(_) => {
            //failed to lock audio manager
        },
    }
}

#[tauri::command]
pub fn seek_to(audio_manager: State<'_, Mutex<SharedAudioManager>>, position: f64){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.seek_to(position){
                        Ok(_) => {
                            //seeked to position
                        },
                        Err(_) => {
                            //failed to seek to position
                        },
                    }
                },
                None => {
                    //no song is currently paused or playing
                },
            }
        },
        Err(_) => {
            //failed to lock audio manager
        },
    }
}

/* 
#[tauri::command]
pub fn set_volume(audio_manager: State<'_, Mutex<SharedAudioManager>>, volume: f32){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.set_volume(volume, Tween::default()){
                        Ok(_) => {
                            //set volume
                        },
                        Err(_) => {
                            //failed to set volume
                        },
                    }
                },
                None => {
                    //no song is currently paused or playing
                },
            }
        },
        Err(_) => {
            //failed to lock audio manager
        },
    }
}
*/
