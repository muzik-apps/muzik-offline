use std::{env, fs};
use dotenv::dotenv;

fn main() {
    dotenv().ok();

    let mut config_data = String::new();
    for (key, value) in env::vars() {
        if key.starts_with("DISCORD_CLIENT_ID") {
            config_data.push_str(&format!("pub const {}: &str = {:?};\n", key, value));
        }
    }

    let out_dir = match env::var("OUT_DIR") {
        Ok(out_dir) => out_dir,
        Err(_) => panic!("OUT_DIR not found"),
    };
    
    let dest_path = format!("{}/env_vars.rs", out_dir);
    match fs::write(dest_path, config_data){
        Ok(_) => println!("Successfully wrote env vars to file"),
        Err(e) => panic!("Failed to write env vars to file: {}", e),
    };
    tauri_build::build()
}
