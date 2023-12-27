use tauri::State;
use kira::{
	sound::streaming::{StreamingSoundData, StreamingSoundSettings}, tween::Tween
};
use std::sync::Mutex;
use crate::components::SharedAudioManager;

#[tauri::command]
pub fn load_and_play_song_from_path(audio_manager: State<'_, Mutex<SharedAudioManager>>, sound_path: &str){
    match audio_manager.lock(){
        Ok(mut manager) => {
            //stop and clear all sounds that are playing
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.stop(Tween::default()){
                        Ok(_) => {
                            //stopped song
                        },
                        Err(_) => {
                            return;
                        },
                    }
                },
                None => {
                    //no song is currently playing
                },
            }

            //try and load and play a new song
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
pub fn load_a_song_from_path(audio_manager: State<'_, Mutex<SharedAudioManager>>, sound_path: &str){
    match audio_manager.lock(){
        Ok(mut manager) => {
            //stop and clear all sounds that are playing
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.stop(Tween::default()){
                        Ok(_) => {
                            //stopped song
                        },
                        Err(_) => {
                            return;
                        },
                    }
                },
                None => {
                    //no song is currently playing
                },
            }

            //try and load and play then immediately pause a new song
            match StreamingSoundData::from_file(sound_path, StreamingSoundSettings::default()){
                Ok(sound_data) => {
                    match manager.manager.play(sound_data){
                        Ok(instance_handle) => {
                            //playback started
                            manager.instance_handle = Some(instance_handle);
                            //pause the song
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
pub fn stop_song(audio_manager: State<'_, Mutex<SharedAudioManager>>){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.stop(Tween::default()){
                        Ok(_) => {
                            //stopped song
                        },
                        Err(_) => {
                            //failed to stop song
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
                            //there seems to be a weird issue where the song will seek correctly
                            //but the position will not update until the song is resumed
                            //so we will lower the volume to 0, play, then pause, then restore the previous volume
                            //this is a hacky solution but it works
                            
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

#[tauri::command]
pub fn get_song_position(audio_manager: State<'_, Mutex<SharedAudioManager>>) -> f64{
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    let song_position = handle.position();
                    song_position.floor()
                },
                None => {
                    //no song is currently paused or playing
                    0.0
                },
            }
        },
        Err(_) => {
            //failed to lock audio manager
            0.0
        },
    }
}

/* 
#[tauri::command]
pub fn set_volume(audio_manager: State<'_, Mutex<SharedAudioManager>>, volume: i32){
    match audio_manager.lock(){
        Ok(mut manager) => {
            match &mut manager.instance_handle{
                Some(handle) => {
                    match handle.set_volume(0.5, Tween::default()){
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

fn get_volume_value(volume: i32) -> f32{
    match volume{
        0 => 0.0,
        1 => 0.1,
        2 => 0.2,
        3 => 0.3,
        4 => 0.4,
        5 => 0.5,
        6 => 0.6,
        7 => 0.7,
        8 => 0.8,
        9 => 0.9,
        10 => 1.0,
        _ => 0.5,
    }
}*/