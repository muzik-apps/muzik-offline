use rodio::{OutputStream, Device, Sink};
use std::sync::{Arc, Mutex};
use std::sync::mpsc::{channel, Sender};
use std::time::Duration;

enum AudioCommand {
    SetDevice(Device, Duration)
}

pub struct RodioManager {
    sender: Sender<AudioCommand>,
    pub sink: Arc<Mutex<Option<Sink>>>,
    pub crossfade: bool,
    pub duration: Option<Duration>,
}

impl RodioManager {
    pub fn new() -> Self {
        let (sender, receiver) = channel();
        let sink: Arc<Mutex<Option<Sink>>> = Arc::new(Mutex::new(None));
        let cloned_sink = sink.clone();

        std::thread::spawn(move || {
            // Initialize the default output stream
            let (mut _current_stream, mut _current_handle) = OutputStream::try_default().expect("No default output stream available");
            cloned_sink.lock().expect("unable to lock").replace(Sink::try_new(&_current_handle).expect("Failed to create sink"));

            for command in receiver {
                match command {
                    AudioCommand::SetDevice(device, pos) => {
                        if let Ok((new_stream, new_handle)) = OutputStream::try_from_device(&device) {
                            let was_paused = match cloned_sink.lock(){
                                Ok(mut sink) => {
                                    match sink.as_mut(){
                                        Some(sink) => {
                                            sink.is_paused()
                                        }
                                        None => {
                                            false
                                        }
                                    }
                                }
                                Err(_) => {
                                    false
                                }
                            };

                            _current_stream = new_stream;
                            _current_handle = new_handle;
                            match cloned_sink.lock(){
                                Ok(mut sink) => {
                                    match sink.as_mut(){
                                        Some(sink) => {
                                            match sink.try_seek(pos){
                                                Ok(_) => {
                                                    if !was_paused {
                                                        sink.play();
                                                    }
                                                }
                                                Err(_) => {
                                                    eprintln!("Failed to seek sink");
                                                }
                                            }
                                        }
                                        None => {
                                            eprintln!("Failed to lock sink");
                                        }
                                    }
                                }
                                Err(_) => {
                                    eprintln!("Failed to lock sink");
                                }
                            }
                            println!("Switched audio device successfully!");
                        } else {
                            eprintln!("Failed to switch audio device");
                        }
                    }
                }
            }
        });

        Self { 
            sender,
            sink: sink.clone(),
            crossfade: false,
            duration: None,
        }
    }

    pub fn set_device(&self, device: Device, pos: Duration) {
        match self.sender.send(AudioCommand::SetDevice(device, pos)){
            Ok(_) => {

            }
            Err(_) => {
                
            }
        }
    }
}