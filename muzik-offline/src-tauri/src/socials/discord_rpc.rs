use discord_rich_presence::{activity, DiscordIpc, DiscordIpcClient};

pub struct DiscordRpc {
    client_id: String,
    client: DiscordIpcClient,
    allowed_to_connect: bool,
}

impl DiscordRpc {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let client_id = String::from("1197657294490583071");
        let client: DiscordIpcClient = DiscordIpcClient::new(&client_id)?;

        Ok(
            Self {
                client_id,
                client,
                allowed_to_connect: false,
            }
        )
    }

    pub fn connect(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            self.client.connect()?;
        }
        Ok(())
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
        }
        Ok(())
    }

    pub fn clear_activity(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            self.client.clear_activity()?;
        }
        Ok(())
    }

    pub fn close(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        if self.allowed_to_connect {
            self.client.close()?;
        }
        Ok(())
    }
}