use tauri::State;
use std::sync::Mutex;

pub struct NormalPlayList{
    remaining_keys: Vec<usize>,
    untouched_keys: Vec<usize>,
    batch_size: usize,
}

impl NormalPlayList {
    // Create a new normalplaylist instance
    pub fn new(total_songs: usize, batch_size: usize) -> Self {
        let remaining_keys = (1..=total_songs).collect();
        let untouched_keys = Vec::new();
        NormalPlayList {
            remaining_keys,
            untouched_keys,
            batch_size,
        }
    }

    pub fn set_total_songs(&mut self, total_songs: usize) {
        self.remaining_keys = (1..=total_songs).collect();
        self.untouched_keys = Vec::new();
    }

    pub fn set_batch_size(&mut self, batch_size: usize) {
        self.batch_size = batch_size;
    }

    pub fn set_total_songs_and_batch_size(&mut self, total_songs: usize, batch_size: usize) {
        self.remaining_keys = (1..=total_songs).collect();
        self.untouched_keys = Vec::new();
        self.batch_size = batch_size;
    }

    pub fn reset_and_set_remaining_keys(&mut self, remaining_keys: Vec<usize>) {
        self.remaining_keys = remaining_keys.clone();
        self.untouched_keys = Vec::new();
        self.batch_size = remaining_keys.len();
    }

    // Fetch the next batch of reset-ed keys
    pub fn get_next_batch(&mut self) -> Vec<usize> {
        if self.remaining_keys.is_empty() {
            // If all keys have been fetched, reset
            self.remaining_keys = self.untouched_keys.clone();
            self.untouched_keys.clear();
        }

        let batch = self.remaining_keys.drain(..self.batch_size).collect();
        self.untouched_keys.extend(&batch);
        batch
    }

    pub fn get_next_batch_as_size(&mut self, size: usize) -> Vec<usize> {
        if self.remaining_keys.is_empty() {
            // If all keys have been fetched, reset
            self.remaining_keys = self.untouched_keys.clone();
            self.untouched_keys.clear();
        }

        let batch = self.remaining_keys.drain(..size).collect();
        self.untouched_keys.extend(&batch);
        batch
    }
}

#[tauri::command]
pub fn normalplaylist_set_total_songs(normalplaylist: State<'_, Mutex<NormalPlayList>>, total_songs: usize){
    match normalplaylist.lock(){
        Ok(mut normalplaylist) => {
            normalplaylist.set_total_songs(total_songs);
        },
        Err(_) => {
            //failed to lock normalplaylist
        },
    }
}

#[tauri::command]
pub fn normalplaylist_set_batch_size(normalplaylist: State<'_, Mutex<NormalPlayList>>, batch_size: usize){
    match normalplaylist.lock(){
        Ok(mut normalplaylist) => {
            normalplaylist.set_batch_size(batch_size);
        },
        Err(_) => {
            //failed to lock normalplaylist
        },
    }
}

#[tauri::command]
pub fn normalplaylist_set_total_songs_and_batch_size(normalplaylist: State<'_, Mutex<NormalPlayList>>, total_songs: usize, batch_size: usize){
    match normalplaylist.lock(){
        Ok(mut normalplaylist) => {
            normalplaylist.set_total_songs_and_batch_size(total_songs, batch_size);
        },
        Err(_) => {
            //failed to lock normalplaylist
        },
    }
}

#[tauri::command]
pub fn normalplaylist_reset_and_set_remaining_keys(normalplaylist: State<'_, Mutex<NormalPlayList>>, remaining_keys: Vec<usize>){
    match normalplaylist.lock(){
        Ok(mut normalplaylist) => {
            normalplaylist.reset_and_set_remaining_keys(remaining_keys);
        },
        Err(_) => {
            //failed to lock normalplaylist
        },
    }
}

#[tauri::command]
pub fn normalplaylist_get_next_batch(normalplaylist: State<'_, Mutex<NormalPlayList>>) -> Vec<usize>{
    match normalplaylist.lock(){
        Ok(mut normalplaylist) => {
            normalplaylist.get_next_batch()
        },
        Err(_) => {
            //failed to lock normalplaylist
            Vec::new()
        },
    }
}

#[tauri::command]
pub fn normalplaylist_get_next_batch_as_size(normalplaylist: State<'_, Mutex<NormalPlayList>>, size: usize) -> Vec<usize>{
    match normalplaylist.lock(){
        Ok(mut normalplaylist) => {
            normalplaylist.get_next_batch_as_size(size)
        },
        Err(_) => {
            //failed to lock normalplaylist
            Vec::new()
        },
    }
}