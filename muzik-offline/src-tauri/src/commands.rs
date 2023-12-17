use std::process::Command;

#[cfg(target_os = "macos")]
pub fn open_file_at(file_path: &str) {
    match Command::new( "open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}

#[cfg(target_os = "windows")]
pub fn open_file_at(file_path: &str) {
    match Command::new( "explorer" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}

#[cfg(target_os = "linux")]
pub fn open_file_at(file_path: &str) {
    match Command::new( "xdg-open" )
        .arg( file_path ) // <- Specify the directory you'd like to open.
        .spawn( )
    {
        Ok(_) => {},
        Err(_) => {},
    }
}