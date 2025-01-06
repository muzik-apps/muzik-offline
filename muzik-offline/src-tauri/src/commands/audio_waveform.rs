use std::process::Command;

use crate::commands::general_commands::get_waveform_dir;

#[tauri::command]
pub fn check_if_audio_waveform_is_installed() -> bool {
    // if windows check audiowaveform.exe exists in embedded additional files
    #[cfg(windows)]
    {
        use super::general_commands::get_lib_dir;

        let lib_dir = match get_lib_dir() {
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
        if Command::new("audiowaveform")
            .arg("--version")
            .status()
            .is_err()
        {
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

        let lib_dir = match get_lib_dir() {
            Ok(lib_dir) => lib_dir,
            Err(_) => return Err("Error getting lib directory".to_string()),
        };

        // check if zip file already exists and skip the below command
        if !std::path::Path::new(&format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir)).exists() {
            let command = Command::new("curl")
                .args([
                    "-L",
                    "-o",
                    &format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir),
                    "https://github.com/bbc/audiowaveform/releases/download/1.10.1/audiowaveform-1.10.1.win64.zip"
                ])
                .status();

            if command.is_err() {
                println!("Error downloading audiowaveform due to {:?}", command.err());
                return Err("Error downloading audiowaveform".to_string());
            }
        }

        let command = Command::new("tar")
            .args([
                "-xf",
                &format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir),
                "-",
                "-C",
                &lib_dir,
            ])
            .status();

        if command.is_err() {
            println!("Error unzipping audiowaveform due to {:?}", command.err());
            return Err("Error unzipping audiowaveform".to_string());
        }

        // check if audiowaveform.exe exists
        if !check_if_audio_waveform_is_installed() {
            println!("Error installing audiowaveform");
            return Err("Error installing audiowaveform".to_string());
        }

        // delete the zip file
        let command = Command::new("del")
            .args([&format!("{}/audiowaveform-1.10.1.win64.zip", lib_dir)])
            .status();

        // even if the delete fails, the audiowaveform.exe is installed so return success
        if command.is_err() {
            println!(
                "Error deleting audiowaveform zip file due to {:?}",
                command.err()
            );
            // intentionally ignore error
        }

        return Ok("Audiowaveform installed".to_string());
    }

    // if macos install with brew
    #[cfg(target_os = "macos")]
    {
        use crate::constants::constants::MACOS_INSTALL_COMMANDS;

        for command in MACOS_INSTALL_COMMANDS.iter() {
            let command = Command::new(command[0]).args(&command[1..]).status();

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
            DEBIAN_INSTALL_COMMANDS, RPM_INSTALL_COMMANDS, UBUNTU_INSTALL_COMMANDS,
        };
        use os_info;

        let os_info = os_info::get();

        if os_info.os_type() == os_info::Type::Ubuntu {
            for command in UBUNTU_INSTALL_COMMANDS.iter() {
                let command = Command::new(command[0]).args(&command[1..]).status();

                if command.is_err() {
                    return Err("Error installing audiowaveform".to_string());
                }
            }
        } else if os_info.os_type() == os_info::Type::Debian {
            for command in DEBIAN_INSTALL_COMMANDS.iter() {
                let command = Command::new(command[0]).args(&command[1..]).status();

                if command.is_err() {
                    return Err("Error installing audiowaveform".to_string());
                }
            }
        } else if os_info.os_type() == os_info::Type::Redhat {
            for command in RPM_INSTALL_COMMANDS.iter() {
                let command = Command::new(command[0]).args(&command[1..]).status();

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

pub async fn decode_waveform(audio_path: &str) -> Result<String, String> {
    let waveform_dir = match get_waveform_dir() {
        Ok(waveform_dir) => waveform_dir,
        Err(_) => return Err("Error getting waveform directory".to_string()),
    };

    // check if waveform file already exists and return the path
    if std::path::Path::new(&format!("{}/{}.dat", waveform_dir, audio_path)).exists() {
        match std::fs::read_to_string(&format!("{}/{}.dat", waveform_dir, audio_path)) {
            Ok(waveform) => return Ok(waveform),
            Err(_) => return Err("Error reading waveform".to_string()),
        }
    }

    // if windows use audiowaveform.exe
    #[cfg(windows)]
    {
        use super::general_commands::get_lib_dir;

        let lib_dir = match get_lib_dir() {
            Ok(lib_dir) => lib_dir,
            Err(_) => return Err("Error getting lib directory".to_string()),
        };

        let command = Command::new(format!("{}/audiowaveform.exe", lib_dir))
            .args([
                "-i",
                audio_path,
                "-o",
                &format!("{}/{}.dat", waveform_dir, ""),
                "-b",
                "8",
                "--pixels-per-second",
                "10",
            ])
            .status();

        if command.is_err() {
            println!("Error decoding waveform due to {:?}", command.err());
            return Err("Error decoding waveform".to_string());
        }

        let waveform =
            match std::fs::read_to_string(&format!("{}/{}.dat", waveform_dir, audio_path)) {
                Ok(waveform) => waveform,
                Err(_) => return Err("Error reading waveform".to_string()),
            };

        return Ok(waveform);
    }

    // if macos and linux use audiowaveform
    #[cfg(not(windows))]
    {
        let command = Command::new("audiowaveform")
            .args([
                "-i",
                audio_path,
                "-o",
                &format!("{}/{}.dat", waveform_dir, ""),
                "-b",
                "8",
                "--pixels-per-second",
                "10",
            ])
            .status();

        if command.is_err() {
            println!("Error decoding waveform due to {:?}", command.err());
            return Err("Error decoding waveform".to_string());
        }

        let waveform =
            match std::fs::read_to_string(&format!("{}/{}.dat", waveform_dir, audio_path)) {
                Ok(waveform) => waveform,
                Err(_) => return Err("Error reading waveform".to_string()),
            };

        return Ok(waveform);
    }
}
