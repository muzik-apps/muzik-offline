use souvlaki::{MediaControlEvent, MediaControls, MediaMetadata, PlatformConfig};

pub struct MCA{
    controls: MediaControls,
}


impl MCA{
    pub fn new() -> Result<Self, String> {
        #[cfg(not(target_os = "windows"))]
        let hwnd = None;

        #[cfg(target_os = "windows")]
        let hwnd = {
            use raw_window_handle::windows::WindowsHandle;

            let handle: WindowsHandle = unimplemented!();
            Some(handle.hwnd)
        };

        let config = PlatformConfig {
            dbus_name: "muzik-offline",
            display_name: "muzik-offline",
            hwnd,
        };

        let mut controls = {
            match MediaControls::new(config){
                Ok(cntrl) =>{
                    cntrl
                }
                Err(_) => {
                    Err("failed to create media controls")?
                }
            }};

        Ok(
            MCA { 
                controls  
            }
        )
    }
}