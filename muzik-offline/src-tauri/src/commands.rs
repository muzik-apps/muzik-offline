use std::process::Command;

#[tauri::command]
pub fn open_in_file_manager(file_path: &str) {
    open_file_at(&file_path);
}

#[cfg(target_os = "macos")]
fn open_file_at(file_path: &str) {
    match Command::new( "open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}

#[cfg(target_os = "windows")]
fn open_file_at(file_path: &str) {
    match Command::new( "explorer" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}

#[cfg(target_os = "linux")]
fn open_file_at(file_path: &str) {
    match Command::new( "xdg-open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}