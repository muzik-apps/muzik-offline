use rand::seq::SliceRandom;
use tauri::State;
use std::sync::Mutex;

pub struct MLO{
    remaining_keys: Vec<usize>,
    drained_keys: Vec<usize>,
    untouched_keys: Vec<usize>,
    shuffle_list: bool,
    repeat_list: bool,
}

impl MLO {
    // Create a new MLO instance
    pub fn new() -> Self {
        let remaining_keys = Vec::new();
        let drained_keys = Vec::new();
        let untouched_keys = Vec::new();
        let shuffle_list = false;
        let repeat_list = false;
        MLO {
            remaining_keys,
            drained_keys,
            untouched_keys,
            shuffle_list,
            repeat_list
        }
    }

    pub fn set_shuffle_list(&mut self, shuffle_list: bool) {
        self.shuffle_list = shuffle_list;
    }

    pub fn set_repeat_list(&mut self, repeat_list: bool) {
        self.repeat_list = repeat_list;
    }

    pub fn reset_and_set_remaining_keys(&mut self, keys: Vec<usize>) {
        self.remaining_keys = keys.clone();
        self.untouched_keys = keys.clone();
        self.drained_keys = Vec::new();
    }

    pub fn get_next_batch_as_size(&mut self, size: usize) -> Vec<usize> {
        if self.remaining_keys.is_empty() && self.repeat_list == true {
            // If all keys have been fetched, reshuffle
            self.remaining_keys = self.untouched_keys.clone();
            self.drained_keys.clear();
            if self.shuffle_list {
                self.remaining_keys.shuffle(&mut rand::thread_rng());
            }
        }
        else if self.remaining_keys.is_empty() && self.repeat_list == false{
            return Vec::new();
        }
        //research more into unshuffling after a shuffling has already been done
        

        let batch: Vec<usize> = self.remaining_keys.drain(..size).collect();
        self.drained_keys.extend(&batch);
        batch
    }
}

#[tauri::command]
pub fn mlo_set_shuffle_list(mlo: State<'_, Mutex<MLO>>, shuffle_list: bool) -> Result<String, String>{
    match mlo.lock(){
        Ok(mut mlo) => {
            mlo.set_shuffle_list(shuffle_list);
            Ok(String::from("SUCCESS"))
        },
        Err(_) => {
            Err(String::from("FAILED"))
        },
    }
}

#[tauri::command]
pub fn mlo_set_repeat_list(mlo: State<'_, Mutex<MLO>>, repeat_list: bool) -> Result<String, String> {
    match mlo.lock(){
        Ok(mut mlo) => {
            mlo.set_repeat_list(repeat_list);
            Ok(String::from("SUCCESS"))
        },
        Err(_) => {
            Err(String::from("FAILED"))
        },
    }
}

#[tauri::command]
pub fn mlo_reset_and_set_remaining_keys(mlo: State<'_, Mutex<MLO>>, remaining_keys: Vec<usize>) -> Result<String, String> {
    match mlo.lock(){
        Ok(mut mlo) => {
            mlo.reset_and_set_remaining_keys(remaining_keys);
            Ok(String::from("SUCCESS"))
        },
        Err(_) => {
            Err(String::from("FAILED"))
        },
    }
}

#[tauri::command]
pub fn mlo_get_next_batch_as_size(mlo: State<'_, Mutex<MLO>>, size: usize) -> Vec<usize>{
    match mlo.lock(){
        Ok(mut mlo) => {
            mlo.get_next_batch_as_size(size)
        },
        Err(_) => {
            //failed to lock MLO
            Vec::new()
        },
    }
}