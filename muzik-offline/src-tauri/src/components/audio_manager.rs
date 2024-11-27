use kira::{
    manager::{backend::DefaultBackend, AudioManager},
    sound::{streaming::StreamingSoundHandle, FromFileError},
};
use souvlaki::MediaControls;

pub struct BackendStateManager {
    pub manager: AudioManager<DefaultBackend>,
    pub instance_handle: Option<StreamingSoundHandle<FromFileError>>,
    pub controls: Option<MediaControls>,
    pub volume: f64,
    pub cover_url: String,
    pub port: u16,
}
