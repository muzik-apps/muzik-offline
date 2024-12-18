use tauri::async_runtime::Receiver;
use tauri_plugin_shell::process::{CommandEvent, CommandChild};

pub enum AirplayCastCommands{
    AirplayScan,
    //AirplayConnect,
    AirplayPair,
    AirplayPin,
    //AirplayPairConnect,
    AirplayDisconnect,
    AirplayStream,
    AirplayResume,
    AirplayPause,
    AirplayStop,
    ChromecastScan,
    //ChromecastStopScan,
    ChromecastStream,
    ChromecastResume,
    ChromecastPause,
    ChromecastStop,
}

pub fn airplay_cast_commands_as_string(command: AirplayCastCommands) -> String{
    match command{
        AirplayCastCommands::AirplayScan => "airplay-scan".to_string(),
        //AirplayCastCommands::AirplayConnect => "airplay-connect".to_string(),
        AirplayCastCommands::AirplayPair => "airplay-pair".to_string(),
        AirplayCastCommands::AirplayPin => "airplay-pin".to_string(),
        //AirplayCastCommands::AirplayPairConnect => "airplay-pair-connect".to_string(),
        AirplayCastCommands::AirplayDisconnect => "airplay-disconnect".to_string(),
        AirplayCastCommands::AirplayStream => "airplay-stream".to_string(),
        AirplayCastCommands::AirplayResume => "airplay-resume".to_string(),
        AirplayCastCommands::AirplayPause => "airplay-pause".to_string(),
        AirplayCastCommands::AirplayStop => "airplay-stop".to_string(),
        AirplayCastCommands::ChromecastScan => "chromecast-scan".to_string(),
        //AirplayCastCommands::ChromecastStopScan => "chromecast-stop-scan".to_string(),
        AirplayCastCommands::ChromecastStream => "chromecast-stream".to_string(),
        AirplayCastCommands::ChromecastResume => "chromecast-resume".to_string(),
        AirplayCastCommands::ChromecastPause => "chromecast-pause".to_string(),
        AirplayCastCommands::ChromecastStop => "chromecast-stop".to_string(),
    }
}

#[derive(Default)]
pub struct Process{
    pub child: Option<CommandChild>,
    pub receiver: Option<Receiver<CommandEvent>>,
}