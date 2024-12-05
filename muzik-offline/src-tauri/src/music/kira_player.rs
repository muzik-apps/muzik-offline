use crate::{components::kira_audio_manager::KiraManager, utils::general_utils::calculate_volume};
use kira::{
    sound::{
        streaming::{StreamingSoundData, StreamingSoundHandle, StreamingSoundSettings},
        FromFileError,
    },
    tween::Tween,
};
use std::{sync::{Arc, Mutex}, time::Duration};
use tauri::State;

pub fn load_and_play_song_from_path_kira(
    audio_manager: State<'_, Arc<Mutex<KiraManager>>>,
    sound_path: &str,
    volume: f64,
    duration: f64,
    play_back_speed: f32,
    fade_in_out: bool,
) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            //stop and clear all sounds that are playing
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.stop(Tween::default()) {
                        Ok(_) => {
                            //stopped song
                        }
                        Err(_) => {
                            return;
                        }
                    }
                }
                None => {
                    //no song is currently playing
                }
            }

            if fade_in_out {
                manager.crossfade = true;
            } else {
                manager.crossfade = false;
            }

            manager.duration = Some(Duration::from_secs_f64(duration));

            //try and load and play a new song
            match StreamingSoundData::from_file(sound_path, StreamingSoundSettings::default()) {
                Ok(sound_data) => {
                    if fade_in_out {
                        sound_data.settings.fade_in_tween(Tween{
                            duration: Duration::from_secs(6),
                            start_time: kira::StartTime::Immediate,
                            easing: kira::tween::Easing::Linear,
                        });
                    }
                    match manager.manager.play(sound_data) {
                        Ok(instance_handle) => {
                            //playback started
                            manager.instance_handle = Some(instance_handle);

                            //set playback speed
                            match &mut manager.instance_handle {
                                Some(handle) => {
                                    match handle.set_playback_rate(play_back_speed as f64, Tween::default()) {
                                        Ok(_) => {
                                            //set speed
                                        }
                                        Err(_) => {
                                            //failed to set speed
                                        }
                                    }
                                }
                                None => {
                                    //no song is currently playing
                                }
                            }
                        
                            if !fade_in_out {
                                //set volume
                                match &mut manager.instance_handle {
                                    Some(handle) => {
                                        match handle.set_volume(volume, Tween::default()) {
                                            Ok(_) => {
                                                //set volume
                                                manager.volume = volume;
                                            }
                                            Err(_) => {
                                                //failed to set volume
                                            }
                                        }
                                    }
                                    None => {
                                        //no song is currently playing
                                    }
                                }
                            }
                        }
                        Err(_) => {
                            //playback failed
                        }
                    }
                }
                Err(_) => {
                    //failed to load sound
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn load_a_song_from_path_kira(
    audio_manager: State<'_, Arc<Mutex<KiraManager>>>,
    sound_path: &str,
    volume: f64,
    duration: f64,
    play_back_speed: f32,
    fade_in_out: bool,
) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            //stop and clear all sounds that are playing
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.stop(Tween::default()) {
                        Ok(_) => {
                            //stopped song
                        }
                        Err(_) => {
                            return;
                        }
                    }
                }
                None => {
                    //no song is currently playing
                }
            }

            if fade_in_out {
                manager.crossfade = true;
            } else {
                manager.crossfade = false;
            }
            manager.duration = Some(Duration::from_secs_f64(duration));

            //try and load and play then immediately pause a new song
            match StreamingSoundData::from_file(sound_path, StreamingSoundSettings::default()) {
                Ok(sound_data) => {
                    if fade_in_out {
                        sound_data.settings.fade_in_tween(Tween{
                            duration: Duration::from_secs(6),
                            ..Default::default()
                        });
                    }
                    match manager.manager.play(sound_data) {
                        Ok(instance_handle) => {
                            //playback started
                            manager.instance_handle = Some(instance_handle);
                            //pause the song
                            match &mut manager.instance_handle {
                                Some(handle) => {
                                    match handle.pause(Tween::default()) {
                                        Ok(_) => {
                                            //paused song
                                        }
                                        Err(_) => {
                                            //failed to pause song
                                        }
                                    }
                                }
                                None => {
                                    //no song is currently playing
                                }
                            }

                            //set playback speed
                            match &mut manager.instance_handle {
                                Some(handle) => {
                                    match handle.set_playback_rate(play_back_speed as f64, Tween::default()) {
                                        Ok(_) => {
                                            //set speed
                                        }
                                        Err(_) => {
                                            //failed to set speed
                                        }
                                    }
                                }
                                None => {
                                    //no song is currently playing
                                }
                            }

                            //set volume
                            match &mut manager.instance_handle {
                                Some(handle) => {
                                    match handle.set_volume(volume, Tween::default()) {
                                        Ok(_) => {
                                            //set volume
                                            manager.volume = volume;
                                        }
                                        Err(_) => {
                                            //failed to set volume
                                        }
                                    }
                                }
                                None => {
                                    //no song is currently playing
                                }
                            }
                        }
                        Err(_) => {
                            //playback failed
                        }
                    }
                }
                Err(_) => {
                    //failed to load sound
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn pause_song_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.pause(Tween::default()) {
                        Ok(_) => {
                            //paused song
                        }
                        Err(_) => {
                            //failed to pause song
                        }
                    }
                }
                None => {
                    //no song is currently playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn stop_song_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.stop(Tween::default()) {
                        Ok(_) => {
                            //stopped song
                        }
                        Err(_) => {
                            //failed to stop song
                        }
                    }
                }
                None => {
                    //no song is currently playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn resume_playing_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.resume(Tween::default()) {
                        Ok(_) => {
                            //resumed song
                        }
                        Err(_) => {
                            //failed to resume song
                        }
                    }
                }
                None => {
                    //no song is currently paused or playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn seek_to_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>, position: f64) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            //get volume
            let volume = manager.volume.clone();
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.seek_to(position) {
                        Ok(_) => {
                            handle_true_seeking(handle, volume);
                        }
                        Err(_) => {
                            //failed to seek to position
                        }
                    }
                }
                None => {
                    //no song is currently paused or playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn seek_by_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>, delta: f64) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.seek_by(delta) {
                        Ok(_) => {}
                        Err(_) => {
                            //failed to seek by delta
                        }
                    }
                }
                None => {
                    //no song is currently paused or playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

pub fn get_song_position_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>) -> f64 {
    let (pos, duration, cross_fade) = match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    let song_position = handle.position();
                    (std::time::Duration::from_secs_f64(song_position), manager.duration.unwrap_or(std::time::Duration::from_secs(0)), manager.crossfade)
                }
                None => {
                    //no song is currently paused or playing
                    (std::time::Duration::from_secs(0), std::time::Duration::from_secs(0), false)
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
            (std::time::Duration::from_secs(0), std::time::Duration::from_secs(0), false)
        }
    };

    if cross_fade && pos > duration.saturating_sub(Duration::from_secs(6)) {
        set_volume_kira(audio_manager, calculate_volume(duration.saturating_sub(pos)));
    }
    return pos.as_secs_f64().floor();
}

pub fn set_volume_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>, volume: f64) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.set_volume(volume, Tween::default()) {
                        Ok(_) => {
                            //set volume
                            manager.volume = volume;
                        }
                        Err(_) => {
                            //failed to set volume
                        }
                    }
                }
                None => {
                    //no song is currently paused or playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}

fn handle_true_seeking(handle: &mut StreamingSoundHandle<FromFileError>, volume: f64) {
    //seeked to position
    //there seems to be a weird issue(maybe it's intended to be that way in kira) where the song will seek correctly
    //but the position will not update until the song is resumed
    //Resuming and pausing the song immediately after seems to be unable to fix this
    //but the seeker only updates if the song is resumed and allowed to play without being immediately paused
    //so we resume the song and then pause it after a short delay
    //this is a hacky solution but it works

    //the source of the problem is that when a song is playing, it loads the next chunk of audio data into memory
    //and so when it is paused, that chunk of audio data is still in memory
    //so even if you seek to a new spot, the audio data that was loaded into memory is still there
    //so it will have to be played either way before the new seeked to position can be played
    //the only way around this would be to figure out how to clear the audio data from memory
    //or how long the audio data that we want to skip past is and just allow the song to play for that long
    //before pausing it again whilst the volume is 0.0. Hopefully the user won't notice this because
    //that delay may get as large as 300ms or so depending on the size of the audio data that was loaded into memory

    match handle.set_volume(0.0, Tween::default()) {
        Ok(_) => {
            //set volume
        }
        Err(_) => {
            //failed to set volume
        }
    }

    match handle.resume(Tween::default()) {
        Ok(_) => {
            //resumed song
            //pause the song after a short delay
            std::thread::sleep(std::time::Duration::from_millis(270));
            match handle.pause(Tween::default()) {
                Ok(_) => {
                    //paused song
                }
                Err(_) => {
                    //failed to pause song
                }
            }
        }
        Err(_) => {
            //failed to resume song
        }
    }

    //reset volume back to previous value
    match handle.set_volume(volume, Tween::default()) {
        Ok(_) => {
            //set volume
        }
        Err(_) => {
            //failed to set volume
        }
    }
}

pub fn set_playback_speed_kira(audio_manager: State<'_, Arc<Mutex<KiraManager>>>, speed: f64) {
    match audio_manager.lock() {
        Ok(mut manager) => {
            match &mut manager.instance_handle {
                Some(handle) => {
                    match handle.set_playback_rate(speed, Tween::default()) {
                        Ok(_) => {
                            //set speed
                        }
                        Err(_) => {
                            //failed to set speed
                        }
                    }
                }
                None => {
                    //no song is currently paused or playing
                }
            }
        }
        Err(_) => {
            //failed to lock audio manager
        }
    }
}