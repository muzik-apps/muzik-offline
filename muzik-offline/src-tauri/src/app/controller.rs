use tauri::Runtime;
use tauri::LogicalSize;
use window_vibrancy::{ apply_mica, clear_mica, apply_vibrancy, NSVisualEffectMaterial};

#[tauri::command]
pub fn toggle_miniplayer_view<R: Runtime>(window: tauri::Window<R>, open_mini_player: bool){
    if open_mini_player == true{
        if is_os_windows() == false{
            let _ = window.set_decorations(false);
        }
        let _ = window.set_min_size(Some(LogicalSize::new(218.0, 376.0)));
        let _ = window.set_size(LogicalSize::new(218.0, 376.0));
        let _ = window.set_resizable(false);
    }
    else{
        if is_os_windows() == false{
            let _ = window.set_decorations(true);
        }
        let _ = window.set_resizable(true);
        let _ = window.set_size(LogicalSize::new(980.0, 623.0));
        let _ = window.set_min_size(Some(LogicalSize::new(980.0, 623.0)));
        let _ = window.set_always_on_top(false);
    }
}

#[tauri::command]
pub fn toggle_app_pin<R: Runtime>(window: tauri::Window<R>, pin_app: bool){
    if pin_app == true{
        let _ = window.set_always_on_top(true);
    }
    else{
        let _ = window.set_always_on_top(false);
    }
}

#[tauri::command]
pub fn drag_app_window<R: Runtime>(window: tauri::Window<R>){
    match window.start_dragging(){
        Ok(_) => {

        },
        Err(_) => {

        },
    }
}

fn is_os_windows() -> bool {
    if cfg!(target_os = "windows") {
        return true;
    }
    else{
        return false;
    }
}

#[tauri::command]
pub fn turn_on_translucency<R: Runtime>(window: tauri::Window<R>, os_version: String){
    apply_translucency(&window, os_version);
}

#[tauri::command]
pub fn turn_off_translucency<R: Runtime>(window: tauri::Window<R>, os_version: String){
    unapply_translucency(&window, os_version);
}

#[cfg(target_os = "windows")]
fn apply_translucency<R: Runtime>(window: &tauri::Window<R>, os_version: String){
    if os_version.starts_with("11"){
        match apply_mica(&window, None){
            Ok(_) => {

            },
            Err(_) => {
                println!("Unsupported platform! 'apply_mica' is only supported on Windows 11");
            }
        }
    }
    else{
        println!("Unsupported platform! 'translucency' is only supported on Windows 11");
    }
}

#[cfg(target_os = "macos")]
fn apply_translucency<R: Runtime>(window: &tauri::Window<R>, _os_version: String){
    #[cfg(target_os = "macos")]
    match apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None){
        Ok(_) => {

        }
        Err(e) => {
            println!("Unsupported platform! 'apply_vibrancy' is only supported on macOS > 10.10");
        }
    }
}

#[cfg(target_os = "windows")]
fn unapply_translucency<R: Runtime>(window: &tauri::Window<R>, os_version: String){
    if os_version.starts_with("11"){
        match clear_mica(&window){
            Ok(_) => {

            },
            Err(_) => {
                println!("Unsupported platform! 'clear_mica' is only supported on Windows 11");
            }
        }
    }
    else{
        println!("Unsupported platform! 'translucency' is only supported on Windows 11");
    }
}

#[cfg(target_os = "macos")]
fn unapply_translucency<R: Runtime>(window: &tauri::Window<R>, _os_version: String){
    //translucency cannot be unapplied on macos
}