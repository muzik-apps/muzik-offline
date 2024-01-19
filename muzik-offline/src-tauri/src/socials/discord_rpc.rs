use tauri::State;
use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};
use std::env;
use std::sync::Mutex;

pub struct DiscordRpc {
    client: DiscordIpcClient,
    allowed_to_connect: bool,
}

impl DiscordRpc {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        //get client id from env variables
        let client_id = env::var("DISCORD_CLIENT_ID").expect("DISCORD_CLIENT_ID env variable not set");
        let client: DiscordIpcClient = DiscordIpcClient::new(&client_id)?;

        Ok(
            Self {
                client,
                allowed_to_connect: false,
            }
        )
    }

    pub fn set_allowed_to_connect(&mut self, allowed_to_connect: bool) {
        self.allowed_to_connect = allowed_to_connect;
    }

    pub fn connect(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            self.client.connect()?;
            Ok(())
        }
        else{
            Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "not allowed to connect to discord rpc")))
        }
    }

    pub fn set_activity(&mut self, song_name: String, state: String, large_image_key: String) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            let activity = activity::Activity::new()
                .state(&state)
                .details(&song_name)
                .assets(
                    activity::Assets::new()
                        .large_image(&large_image_key)
                        .large_text(&song_name)
                );
            self.client.set_activity(activity)?;
            Ok(())
        }
        else{
            Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "not allowed to connect to discord rpc")))
        }
    }

    pub fn clear_activity(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            self.client.clear_activity()?;
            Ok(())
        }
        else{
            Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "not allowed to connect to discord rpc")))
        }
    }

    pub fn close(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            self.client.close()?;
            Ok(())
        }
        else{
            Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "not allowed to connect to discord rpc")))
        }
    }
}

impl Drop for DiscordRpc {
    fn drop(&mut self) {
        //fail silently and print out failure but don't crash the application
        //the OS will handle memory cleanup since the application is returning the resources it had allocated anyways
        if self.allowed_to_connect {
            match self.client.close(){
                Ok(_) => {},
                Err(e) => {
                    println!("error while closing discord rpc: {}", e);
                }
            }
        }
    }
}

#[tauri::command]//this will run when the user sets discord rpc to enabled
pub fn allow_connection_and_connect_to_discord_rpc(discord_rpc: State<Mutex<DiscordRpc>>) -> Result<String, String> {
    match discord_rpc.lock(){
        Ok(mut discord_rpc) => {
            discord_rpc.set_allowed_to_connect(true);
            match discord_rpc.connect(){
                Ok(_) => {
                    Ok(String::from("connected to discord rpc"))
                },
                Err(e) => {
                    Err(format!("error while connecting to discord rpc: {}", e))
                }
            }
        },
        Err(e) => {
            Err(format!("error while locking discord rpc mutex: {}", e))
        }
    }
}

#[tauri::command]//this will only ever run once when the application starts
pub fn attempt_to_connect_if_possible(discord_rpc: State<Mutex<DiscordRpc>>) -> Result<String, String> {
    match discord_rpc.lock(){
        Ok(mut discord_rpc) => {
            match discord_rpc.connect(){
                Ok(_) => {
                    Ok(String::from("connected to discord rpc"))
                },
                Err(e) => {
                    Err(format!("error while connecting to discord rpc: {}", e))
                }
            }
        },
        Err(e) => {
            Err(format!("error while locking discord rpc mutex: {}", e))
        }
    }
}

#[tauri::command]//this will run when the user sets discord rpc to disabled
pub fn disallow_connection_and_close_discord_rpc(discord_rpc: State<Mutex<DiscordRpc>>) -> Result<String, String> {
    match discord_rpc.lock(){
        Ok(mut discord_rpc) => {
            match discord_rpc.close(){
                Ok(_) => {
                    discord_rpc.set_allowed_to_connect(false);
                    Ok(String::from("closed discord rpc"))
                },
                Err(e) => {
                    Err(format!("error while closing discord rpc: {}", e))
                }
            }
        },
        Err(e) => {
            Err(format!("error while locking discord rpc mutex: {}", e))
        }
    }
}

#[tauri::command]//this will run when the user changes the song they are listening to
pub fn set_discord_rpc_activity(discord_rpc: State<Mutex<DiscordRpc>>, song_name: String, state: String, large_image_key: String) -> Result<String, String> {
    match discord_rpc.lock(){
        Ok(mut discord_rpc) => {
            match discord_rpc.clear_activity(){
                Ok(_) => {
                    
                },
                Err(e) => {
                    return Err(format!("error while clearing discord rpc activity: {}", e));
                }
            }

            match discord_rpc.set_activity(song_name, state, large_image_key){
                Ok(_) => {
                    Ok(String::from("set discord rpc activity"))
                },
                Err(e) => {
                    Err(format!("error while setting discord rpc activity: {}", e))
                }
            }
        },
        Err(e) => {
            Err(format!("error while locking discord rpc mutex: {}", e))
        }
    }
}

#[tauri::command]//this will run just before the user changes the song they are listening to or when they stop listening to music
pub fn clear_discord_rpc_activity(discord_rpc: State<Mutex<DiscordRpc>>) -> Result<String, String> {
    match discord_rpc.lock(){
        Ok(mut discord_rpc) => {
            match discord_rpc.clear_activity(){
                Ok(_) => {
                    Ok(String::from("cleared discord rpc activity"))
                },
                Err(e) => {
                    Err(format!("error while clearing discord rpc activity: {}", e))
                }
            }
        },
        Err(e) => {
            Err(format!("error while locking discord rpc mutex: {}", e))
        }
    }
}
