use tauri::LogicalSize;
use tauri::Runtime;

#[tauri::command]
pub fn toggle_miniplayer_view<R: Runtime>(window: tauri::Window<R>, open_mini_player: bool) {
    if open_mini_player == true {
        if is_os_macos() == true {
            let _ = window.set_decorations(false);
        }
        let _ = window.set_min_size(Some(LogicalSize::new(218.0, 376.0)));
        let _ = window.set_size(LogicalSize::new(218.0, 376.0));
        let _ = window.set_resizable(false);
    } else {
        if is_os_macos() == true {
            let _ = window.set_decorations(true);
        }
        let _ = window.set_resizable(true);
        let _ = window.set_size(LogicalSize::new(980.0, 623.0));
        let _ = window.set_min_size(Some(LogicalSize::new(980.0, 623.0)));
        let _ = window.set_always_on_top(false);
        let _ = window.center();
    }
}

#[tauri::command]
pub fn toggle_app_pin<R: Runtime>(window: tauri::Window<R>, pin_app: bool) {
    if pin_app == true {
        let _ = window.set_always_on_top(true);
    } else {
        let _ = window.set_always_on_top(false);
    }
}

#[tauri::command]
pub fn drag_app_window<R: Runtime>(window: tauri::Window<R>) {
    match window.start_dragging() {
        Ok(_) => {}
        Err(_) => {}
    }
}

fn is_os_macos() -> bool {
    if cfg!(target_os = "macos") {
        return true;
    } else {
        return false;
    }
}
