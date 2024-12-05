use souvlaki::MediaControls;

pub struct AppAudioManager {
    pub controls: Option<MediaControls>,
    pub cover_url: String,
    pub port: u16,
}
