use kira::{manager::{AudioManager, backend::DefaultBackend}, sound::{streaming::StreamingSoundHandle, FromFileError}};
use souvlaki::MediaControls;

pub struct SharedAudioManager {
    pub manager: AudioManager<DefaultBackend>,
    pub instance_handle: Option<StreamingSoundHandle<FromFileError>>,
    pub controls: Option<MediaControls>,
    pub volume: f64,
}