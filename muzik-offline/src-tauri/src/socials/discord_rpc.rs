use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::State;

use crate::utils::general_utils::get_cover_url_for_discord;

#[cfg(debug_assertions)] // Use dotenv in development mode
use dotenv::dotenv;

#[cfg(debug_assertions)]
use std::env;

#[cfg(not(debug_assertions))] // Use embedded variables in release mode
include!(concat!(env!("OUT_DIR"), "/env_vars.rs"));

pub struct DiscordRpc {
    client: DiscordIpcClient,
    allowed_to_connect: bool,
    is_connected: bool,
}

impl DiscordRpc {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        #[cfg(debug_assertions)]
        {
            dotenv().ok();
            let client_id = env::var("DISCORD_CLIENT_ID").expect("DISCORD_CLIENT_ID env variable not set");
            let client: DiscordIpcClient = DiscordIpcClient::new(&client_id)?;
            return Ok(Self {
                client,
                allowed_to_connect: false,
                is_connected: false,
            });
        }

        #[cfg(not(debug_assertions))]
        {
            let client_id = DISCORD_CLIENT_ID; // Use embedded variable
            let client: DiscordIpcClient = DiscordIpcClient::new(client_id)?;
            return Ok(Self {
                client,
                allowed_to_connect: false,
                is_connected: false,
            });
        }
    }

    pub fn set_allowed_to_connect(&mut self, allowed_to_connect: bool) {
        self.allowed_to_connect = allowed_to_connect;
    }

    pub fn connect(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect && !self.is_connected {
            self.client.connect()?;
            self.is_connected = true;
            Ok(())
        } else {
            Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "not allowed to connect to discord rpc or is already connected",
            )))
        }
    }

    pub fn set_activity_with_timestamps(
        &mut self,
        name: String,
        artist: String,
        duration: Duration,
        cover_url: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        //if not connected, attempt to connect
        if !self.is_connected {
            self.connect()?;
        }

        if self.allowed_to_connect && self.is_connected {
            let start_time = SystemTime::now();
            let end_time = start_time + duration;

            let start_timestamp = start_time.duration_since(UNIX_EPOCH)?.as_secs() as i64;
            let end_timestamp = end_time.duration_since(UNIX_EPOCH)?.as_secs() as i64;

            let activity = activity::Activity::new()
                .state(&artist)
                .details(&name)
                .activity_type(activity::ActivityType::Listening)
                .timestamps(
                    activity::Timestamps::new()
                        .start(start_timestamp)
                        .end(end_timestamp),
                )
                .assets(
                    activity::Assets::new()
                        .large_image(&cover_url)
                        .large_text(&name)
                        .small_image("app_icon1024x1024")
                        .small_text("muzik-offline"),
                );
            self.client.set_activity(activity)?;
            Ok(())
        } else {
            Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "not allowed to connect to discord rpc or is not connected to discord rpc",
            )))
        }
    }

    pub fn set_activity(
        &mut self,
        name: String,
        artist: String,
        cover_url: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        //if not connected, attempt to connect
        if !self.is_connected {
            self.connect()?;
        }

        if self.allowed_to_connect && self.is_connected {
            let activity = activity::Activity::new()
                .state(&artist)
                .details(&name)
                .activity_type(activity::ActivityType::Listening)
                .assets(
                    activity::Assets::new()
                        .large_image(&cover_url)
                        .large_text(&name)
                        .small_image("app_icon1024x1024")
                        .small_text("muzik-offline"),
                );
            self.client.set_activity(activity)?;
            Ok(())
        } else {
            Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "not allowed to connect to discord rpc or is not connected to discord rpc",
            )))
        }
    }

    pub fn clear_activity(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        //if not connected, attempt to connect
        if !self.is_connected {
            self.connect()?;
        }

        if self.allowed_to_connect && self.is_connected {
            self.client.clear_activity()?;
            Ok(())
        } else {
            Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                "not allowed to connect to discord rpc or is not connected to discord rpc",
            )))
        }
    }

    pub fn close(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.is_connected {
            self.client.close()?;
            self.is_connected = false;
            Ok(())
        } else {
            Ok(())
        }
    }
}

impl Drop for DiscordRpc {
    fn drop(&mut self) {
        //fail silently and print out failure but don't crash the application
        //the OS will handle memory cleanup since the application is returning the resources it had allocated anyways
        if self.allowed_to_connect {
            match self.client.close() {
                Ok(_) => {}
                Err(e) => {
                    println!("error while closing discord rpc: {}", e);
                }
            }
        }
    }
}

#[tauri::command] //this will run when the user sets discord rpc to enabled
pub fn allow_connection_and_connect_to_discord_rpc(
    discord_rpc: State<Mutex<DiscordRpc>>,
) -> Result<String, String> {
    match discord_rpc.lock() {
        Ok(mut discord_rpc) => {
            discord_rpc.set_allowed_to_connect(true);
            match discord_rpc.connect() {
                Ok(_) => Ok(String::from("connected to discord rpc")),
                Err(e) => Err(format!("error while connecting to discord rpc: {}", e)),
            }
        }
        Err(e) => Err(format!("error while locking discord rpc mutex: {}", e)),
    }
}

#[tauri::command] //this will only ever run once when the application starts
pub fn attempt_to_connect_if_possible(
    discord_rpc: State<Mutex<DiscordRpc>>,
) -> Result<String, String> {
    match discord_rpc.lock() {
        Ok(mut discord_rpc) => match discord_rpc.connect() {
            Ok(_) => Ok(String::from("connected to discord rpc")),
            Err(e) => Err(format!("error while connecting to discord rpc: {}", e)),
        },
        Err(e) => Err(format!("error while locking discord rpc mutex: {}", e)),
    }
}

#[tauri::command] //this will run when the user sets discord rpc to disabled
pub fn disallow_connection_and_close_discord_rpc(
    discord_rpc: State<Mutex<DiscordRpc>>,
) -> Result<String, String> {
    match discord_rpc.lock() {
        Ok(mut discord_rpc) => match discord_rpc.close() {
            Ok(_) => {
                discord_rpc.set_allowed_to_connect(false);
                Ok(String::from("closed discord rpc"))
            }
            Err(e) => Err(format!("error while closing discord rpc: {}", e)),
        },
        Err(e) => Err(format!("error while locking discord rpc mutex: {}", e)),
    }
}

#[tauri::command] //this will run when the user changes the song they are listening to
pub fn set_discord_rpc_activity_with_timestamps(
    discord_rpc: State<Mutex<DiscordRpc>>,
    name: String,
    artist: String,
    duration_as_num: i64,
    has_cover: bool,
    id: i32,
) -> Result<String, String> {
    let cover_url = get_cover_url_for_discord(name.clone(), artist.clone(), has_cover, id);

    let duration = Duration::from_secs(duration_as_num as u64);

    match discord_rpc.lock() {
        Ok(mut discord_rpc) => {
            match discord_rpc.clear_activity() {
                Ok(_) => {}
                Err(e) => {
                    return Err(format!("error while clearing discord rpc activity: {}", e));
                }
            }

            match discord_rpc.set_activity_with_timestamps(name, artist, duration, cover_url) {
                Ok(_) => Ok(String::from("set discord rpc activity")),
                Err(e) => Err(format!("error while setting discord rpc activity: {}", e)),
            }
        }
        Err(e) => Err(format!("error while locking discord rpc mutex: {}", e)),
    }
}

#[tauri::command] //this will run when the user changes the song they are listening to
pub fn set_discord_rpc_activity(
    discord_rpc: State<Mutex<DiscordRpc>>,
    name: String,
    artist: String,
    has_cover: bool,
    id: i32,
) -> Result<String, String> {
    let cover_url = get_cover_url_for_discord(name.clone(), artist.clone(), has_cover, id);

    match discord_rpc.lock() {
        Ok(mut discord_rpc) => {
            match discord_rpc.clear_activity() {
                Ok(_) => {}
                Err(e) => {
                    return Err(format!("error while clearing discord rpc activity: {}", e));
                }
            }

            match discord_rpc.set_activity(name, artist, cover_url) {
                Ok(_) => Ok(String::from("set discord rpc activity")),
                Err(e) => Err(format!("error while setting discord rpc activity: {}", e)),
            }
        }
        Err(e) => Err(format!("error while locking discord rpc mutex: {}", e)),
    }
}

#[tauri::command] //this will run just before the user changes the song they are listening to or when they stop listening to music
pub fn clear_discord_rpc_activity(discord_rpc: State<Mutex<DiscordRpc>>) -> Result<String, String> {
    match discord_rpc.lock() {
        Ok(mut discord_rpc) => match discord_rpc.clear_activity() {
            Ok(_) => Ok(String::from("cleared discord rpc activity")),
            Err(e) => Err(format!("error while clearing discord rpc activity: {}", e)),
        },
        Err(e) => Err(format!("error while locking discord rpc mutex: {}", e)),
    }
}
