use tauri::async_runtime::Receiver;
use tauri_plugin_shell::process::{CommandChild, CommandEvent};

pub struct Airplay{
    pub reviever: Option<Receiver<CommandEvent>>,
    pub child: Option<CommandChild>,
}