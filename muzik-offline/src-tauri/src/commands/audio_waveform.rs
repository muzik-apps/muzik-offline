use std::process::Command;

#[tauri::command]
pub fn check_if_audio_waveform_is_installed() -> bool {
    // if windows check audiowaveform.exe exists in embedded additional files
    #[cfg(windows)]
    {
        use super::general_commands::get_lib_dir;

        let lib_dir = match get_lib_dir(){
            Ok(lib_dir) => lib_dir,
            Err(_) => return false,
        };

        let path = format!("{}/audiowaveform.exe", lib_dir);

        // check that the file is executable by getting the version
        if Command::new(path).arg("--version").status().is_err() {
            return false;
        }

        return true;
    }

    // if macos and linux check audiowaveform exists as command by checking version
    #[cfg(not(windows))]
    {
        if Command::new("audiowaveform").arg("--version").status().is_err() {
            return false;
        }

        return true;
    }
}

#[tauri::command]
pub async fn attempt_to_download_audio_waveform() -> Result<String, String> {
    // if windows download audiowaveform.exe from the internet
    #[cfg(windows)]
    {
        use super::general_commands::get_lib_dir;

        let lib_dir = match get_lib_dir(){
            Ok(lib_dir) => lib_dir,
            Err(_) => return Err("Error getting lib directory".to_string()),
        };

        let command = Command::new("curl")
            .args([
                "-L",
                "-o",
                &format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir),
                "https://github.com/bbc/audiowaveform/releases/download/1.10.1/audiowaveform-1.10.1.win64.zip"
            ])
            .status();

        if command.is_err() {
            return Err("Error downloading audiowaveform".to_string());
        }

        let command = Command::new("tar")
            .args([
                "-xf",
                &format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir),
                "audiowaveform.exe"
            ])
            .status();

        if command.is_err() {
            return Err("Error unzipping audiowaveform".to_string());
        }

        // check if audiowaveform.exe exists
        if !check_if_audio_waveform_is_installed() {
            return Err("Error installing audiowaveform".to_string());
        }

        // delete the zip file
        let command = Command::new("del")
            .args([
                &format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir)
            ])
            .status();

        // even if the delete fails, the audiowaveform.exe is installed so return success
        if command.is_err() {
            // intentionally ignore error
        }

        return Ok("Audiowaveform installed".to_string());
    }

    // if macos install with brew
    #[cfg(target_os = "macos")]
    {
        use crate::constants::constants::MACOS_INSTALL_COMMANDS;

        for command in MACOS_INSTALL_COMMANDS.iter() {
            let command = Command::new(command[0])
                .args(&command[1..])
                .status();

            if command.is_err() {
                return Err("Error installing audiowaveform".to_string());
            }
        }

        // check if audiowaveform exists
        if !check_if_audio_waveform_is_installed() {
            return Err("Error installing audiowaveform".to_string());
        }

        return Ok("Audiowaveform installed".to_string());
    }

    // if linux install 
    #[cfg(target_os = "linux")]
    {
        use crate::constants::constants::{
            UBUNTU_INSTALL_COMMANDS,
            DEBIAN_INSTALL_COMMANDS,
            RPM_INSTALL_COMMANDS,
        };
        use os_info;

        let os_info = os_info::get();

        if os_info.os_type() == os_info::Type::Ubuntu {
            for command in UBUNTU_INSTALL_COMMANDS.iter() {
                let command = Command::new(command[0])
                    .args(&command[1..])
                    .status();

                if command.is_err() {
                    return Err("Error installing audiowaveform".to_string());
                }
            }
        } else if os_info.os_type() == os_info::Type::Debian {
            for command in DEBIAN_INSTALL_COMMANDS.iter() {
                let command = Command::new(command[0])
                    .args(&command[1..])
                    .status();

                if command.is_err() {
                    return Err("Error installing audiowaveform".to_string());
                }
            }
        } else if os_info.os_type() == os_info::Type::Redhat {
            for command in RPM_INSTALL_COMMANDS.iter() {
                let command = Command::new(command[0])
                    .args(&command[1..])
                    .status();

                if command.is_err() {
                    return Err("Error installing audiowaveform".to_string());
                }
            }
        } else {
            return Err("Error installing audiowaveform".to_string());
        }

        // check if audiowaveform exists
        if !check_if_audio_waveform_is_installed() {
            return Err("Error installing audiowaveform".to_string());
        }

        return Ok("Audiowaveform installed".to_string());
    }
}
