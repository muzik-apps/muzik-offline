use kira::{
    manager::{backend::DefaultBackend, AudioManager},
    sound::{streaming::StreamingSoundHandle, FromFileError},
};

pub struct KiraManager {
    pub manager: AudioManager<DefaultBackend>,
    pub instance_handle: Option<StreamingSoundHandle<FromFileError>>,
    pub volume: f64,
    pub crossfade: bool,
    pub duration: Option<std::time::Duration>,
}
