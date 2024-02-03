use kira::{manager::{AudioManager, backend::DefaultBackend}, sound::{streaming::StreamingSoundHandle, FromFileError}};

pub struct SharedAudioManager {
    pub manager: AudioManager<DefaultBackend>,
    pub instance_handle: Option<StreamingSoundHandle<FromFileError>>,
    pub volume: f64,
}