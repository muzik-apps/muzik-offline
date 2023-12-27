use rand::seq::SliceRandom;
use tauri::State;
use std::sync::Mutex;

pub struct Shuffler{
    remaining_keys: Vec<usize>,
    shuffled_keys: Vec<usize>,
    batch_size: usize,
}

impl Shuffler {
    // Create a new Shuffler instance
    pub fn new(total_songs: usize, batch_size: usize) -> Self {
        let remaining_keys = (1..=total_songs).collect();
        let shuffled_keys = Vec::new();
        Shuffler {
            remaining_keys,
            shuffled_keys,
            batch_size,
        }
    }

    pub fn set_total_songs(&mut self, total_songs: usize) {
        self.remaining_keys = (1..=total_songs).collect();
        self.shuffled_keys = Vec::new();
    }

    pub fn set_batch_size(&mut self, batch_size: usize) {
        self.batch_size = batch_size;
    }

    pub fn set_total_songs_and_batch_size(&mut self, total_songs: usize, batch_size: usize) {
        self.remaining_keys = (1..=total_songs).collect();
        self.shuffled_keys = Vec::new();
        self.batch_size = batch_size;
    }

    pub fn reset_and_set_remaining_keys(&mut self, remaining_keys: Vec<usize>) {
        self.remaining_keys = remaining_keys.clone();
        self.shuffled_keys = Vec::new();
        self.batch_size = remaining_keys.len();
    }

    // Fetch the next batch of shuffled keys
    pub fn get_next_batch(&mut self) -> Vec<usize> {
        if self.remaining_keys.is_empty() {
            // If all keys have been fetched, reshuffle
            self.remaining_keys = self.shuffled_keys.clone();
            self.shuffled_keys.clear();
            self.remaining_keys.shuffle(&mut rand::thread_rng());
        }

        let batch = self.remaining_keys.drain(..self.batch_size).collect();
        self.shuffled_keys.extend(&batch);
        batch
    }

    pub fn get_next_batch_as_size(&mut self, size: usize) -> Vec<usize> {
        if self.remaining_keys.is_empty() {
            // If all keys have been fetched, reshuffle
            self.remaining_keys = self.shuffled_keys.clone();
            self.shuffled_keys.clear();
            self.remaining_keys.shuffle(&mut rand::thread_rng());
        }

        let batch = self.remaining_keys.drain(..size).collect();
        self.shuffled_keys.extend(&batch);
        batch
    }
}

#[tauri::command]
pub fn set_total_songs(shuffler: State<'_, Mutex<Shuffler>>, total_songs: usize){
    match shuffler.lock(){
        Ok(mut shuffler) => {
            shuffler.set_total_songs(total_songs);
        },
        Err(_) => {
            //failed to lock shuffler
        },
    }
}

#[tauri::command]
pub fn set_batch_size(shuffler: State<'_, Mutex<Shuffler>>, batch_size: usize){
    match shuffler.lock(){
        Ok(mut shuffler) => {
            shuffler.set_batch_size(batch_size);
        },
        Err(_) => {
            //failed to lock shuffler
        },
    }
}

#[tauri::command]
pub fn set_total_songs_and_batch_size(shuffler: State<'_, Mutex<Shuffler>>, total_songs: usize, batch_size: usize){
    match shuffler.lock(){
        Ok(mut shuffler) => {
            shuffler.set_total_songs_and_batch_size(total_songs, batch_size);
        },
        Err(_) => {
            //failed to lock shuffler
        },
    }
}

#[tauri::command]
pub fn reset_and_set_remaining_keys(shuffler: State<'_, Mutex<Shuffler>>, remaining_keys: Vec<usize>){
    match shuffler.lock(){
        Ok(mut shuffler) => {
            shuffler.reset_and_set_remaining_keys(remaining_keys);
        },
        Err(_) => {
            //failed to lock shuffler
        },
    }
}

#[tauri::command]
pub fn get_next_batch(shuffler: State<'_, Mutex<Shuffler>>) -> Vec<usize>{
    match shuffler.lock(){
        Ok(mut shuffler) => {
            shuffler.get_next_batch()
        },
        Err(_) => {
            //failed to lock shuffler
            Vec::new()
        },
    }
}

#[tauri::command]
pub fn get_next_batch_as_size(shuffler: State<'_, Mutex<Shuffler>>, size: usize) -> Vec<usize>{
    match shuffler.lock(){
        Ok(mut shuffler) => {
            shuffler.get_next_batch_as_size(size)
        },
        Err(_) => {
            //failed to lock shuffler
            Vec::new()
        },
    }
}