use super::audio_waveform::{
    attempt_to_download_audio_waveform, check_if_audio_waveform_is_installed,
    uninstall_audio_waveform,
};
use crate::components::package::Package;

#[tauri::command]
pub async fn get_packages() -> Result<String, String> {
    // pre-alloc vector
    let mut packages: Vec<Package> = Vec::with_capacity(1);

    packages.push(Package {
        name: "audiowaveform".to_string(),
        description: "audiowaveform is a C++ command-line application that generates waveform data from either MP3, WAV, or FLAC audio files.".to_string(),
        version: Some("1.10.1".to_string()),
        installed: check_if_audio_waveform_is_installed()
    });

    match serde_json::to_string(&packages) {
        Ok(packages) => Ok(packages),
        Err(_) => Err("Error converting packages to json".to_string()),
    }
}

#[tauri::command]
pub async fn install_package(name: String) -> Result<String, String> {
    match name.as_str() {
        "audiowaveform" => match attempt_to_download_audio_waveform().await {
            Ok(_) => {}
            Err(e) => {
                return Err(e);
            }
        },
        _ => {
            return Err("Package not found".to_string());
        }
    }
    get_packages().await
}

#[tauri::command]
pub async fn uninstall_package(name: String) -> Result<String, String> {
    match name.as_str() {
        "audiowaveform" => match uninstall_audio_waveform().await {
            Ok(_) => {}
            Err(e) => {
                return Err(e);
            }
        },
        _ => {
            return Err("Package not found".to_string());
        }
    }
    get_packages().await
}
