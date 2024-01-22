use rand::seq::SliceRandom;
use tauri::State;
use std::sync::Mutex;

pub struct MLO{
    remaining_keys: Vec<String>,
    drained_keys: Vec<String>,
    untouched_keys: Vec<String>,
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

    pub fn reset_and_set_remaining_keys(&mut self, keys: Vec<String>) {
        self.remaining_keys = keys.clone();
        self.untouched_keys = keys.clone();
        self.drained_keys = Vec::new();
    }

    pub fn get_next_batch_as_size(&mut self, size: usize) -> Vec<String> {
        //these strings can be safely cloned because no singular string is expected to be longer than 
        //40 or so characters example: 577cc90a-c0e1-491a-873f-79d612ecbc05
        //and the max expected batch size is 20, so a vector of 20 strings of length 50 has a minimal effect
        if self.remaining_keys.is_empty(){
            // If all keys have been fetched, reshuffle
            if self.repeat_list == false{
                return Vec::new();
            }
            else{
                self.remaining_keys = self.untouched_keys.clone();
                self.drained_keys.clear();
                if self.shuffle_list {
                    self.remaining_keys.shuffle(&mut rand::thread_rng());
                }
                let batch: Vec<String> = self.remaining_keys.drain(..size).collect();
                let cloned_batch = batch.clone();
                self.drained_keys.extend(batch);
                return cloned_batch;
            }
        }
        else if self.remaining_keys.len() < size {
            // If there are not enough keys left, fetch all remaining keys
            if self.shuffle_list {
                self.remaining_keys.shuffle(&mut rand::thread_rng());
            }
            let batch: Vec<String> = self.remaining_keys.drain(..).collect();
            let cloned_batch = batch.clone();
            self.drained_keys.extend(batch);
            return cloned_batch;
        }
        else if self.remaining_keys.len() == self.untouched_keys.len(){
            //we have just began here so return a shuffled or unshuffled list
            if self.shuffle_list {
                self.remaining_keys.shuffle(&mut rand::thread_rng());
            }
            let batch: Vec<String> = self.remaining_keys.drain(..size).collect();
            let cloned_batch = batch.clone();
            self.drained_keys.extend(batch);
            return cloned_batch;
        }
        //research more into unshuffling after a shuffling has already been done
        else{
            let batch: Vec<String> = self.remaining_keys.drain(..size).collect();
            let cloned_batch = batch.clone();
            self.drained_keys.extend(batch);
            return cloned_batch;
        }
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
pub fn mlo_reset_and_set_remaining_keys(mlo: State<'_, Mutex<MLO>>, remaining_keys: Vec<String>) -> Result<String, String> {
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
pub fn mlo_get_next_batch_as_size(mlo: State<'_, Mutex<MLO>>, size: usize) -> Vec<String>{
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