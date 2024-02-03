import "@styles/App/App.scss";
import { AppMusicPlayer, LeftSidebar, FSMusicPlayer, HeaderLinuxOS, HeaderMacOS, HeaderWindows, NotifyBottomRight } from "@components/index";
import { AllGenres, AllPlaylists, AllTracks, Settings, AlbumDetails, 
  AllAlbums, AllArtists, SearchPage, ArtistCatalogue, GenreView, PlaylistView } from "@pages/index";
import { useEffect, useState } from "react";
import { type } from '@tauri-apps/api/os';
import { invoke } from "@tauri-apps/api";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HistoryNextFloating } from "@layouts/index";
import { OSTYPEenum, toastType } from "@muziktypes/index";
import { AnimatePresence } from "framer-motion";
import { useWallpaperStore, useSavedObjectStore, useToastStore } from "@store/index";
import { SavedObject } from "@database/saved_object";
import { isPermissionGranted, requestPermission } from '@tauri-apps/api/notification';
import { MiniPlayer } from "@App/index";

const App = () => {
  const [openMiniPlayer, setOpenMiniPlayer] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [FSplayerState, setFSplayerState] = useState<boolean>(false);
  const [FloatingHNState, setFloatingHNState] = useState<boolean>(false);
  const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
  const { wallpaper } = useWallpaperStore((state) => { return { wallpaper: state.wallpaper,}; });
  const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

  function closeSetting(){if(openSettings === true)setOpenSettings(false);}

  function toggleSettings(){setOpenSettings(!openSettings);}

  function openPlayer(){setFSplayerState(true);}

  function closePlayer(){setFSplayerState(false);}

  function toggleFloatingHNState(){setFloatingHNState(!FloatingHNState);}

  async function checkOSType(){
    const osType = await type();
    let temp: SavedObject = local_store;
    temp.OStype = osType.toString();
    setStore(temp);
  }

  async function checkAndRequestNotificationPermission(){
    let permissionGranted = await isPermissionGranted();
    if(!permissionGranted)await requestPermission();
  }

  function connect_to_discord(){ 
    if(local_store.AppActivityDiscord === "Yes"){
      invoke("allow_connection_and_connect_to_discord_rpc").then().catch((_) => {
        setToast({
          title: "Discord connection...", message: "Failed to establish connection with discord", type: toastType.error, timeout: 5000
        });
      }); 
    }
  }

  async function ToggleMiniPlayer(){
    let MPV = openMiniPlayer;
    //if miniplayer is open, set the body and html min height to 376px and min width to 218px
    if(!MPV){
      document.body.style.minHeight = "376px";
      document.body.style.minWidth = "218px";
      document.documentElement.style.minHeight = "376px";
      document.documentElement.style.minWidth = "218px";
    }
    //else set the body and html min height to 623px and min width to 980px
    else{
      document.body.style.minHeight = "623px";
      document.body.style.minWidth = "980px";
      document.documentElement.style.minHeight = "623px";
      document.documentElement.style.minWidth = "980px";
    }
    setOpenMiniPlayer(!openMiniPlayer);
    await invoke("toggle_miniplayer_view", {openMiniPlayer: !MPV});
  }

  useEffect(() => {
    checkOSType();
    checkAndRequestNotificationPermission();
    connect_to_discord();
  }, [])

  return (
    <>
    { !openMiniPlayer ?
      <Router>
        <div 
          className={"app_container " + (local_store.OStype ===  OSTYPEenum.Linux || !local_store.AppThemeBlur ? " linux-config " : "")} 
          data-theme={local_store.ThemeColour} 
          wallpaper-opacity={local_store.WallpaperOpacityAmount}
          onContextMenu={(e) => e.preventDefault()}>
            <div className={"background_img " + (wallpaper && wallpaper.DisplayWallpaper ? "" : local_store.BGColour)}>
              {wallpaper && wallpaper.DisplayWallpaper && (<img src={wallpaper.DisplayWallpaper} alt="wallpaper"/>)}
            </div>
            <div className={"app_darkness_layer " + (wallpaper && wallpaper.DisplayWallpaper ? "image_layer" : "color_layer")}>
              {
                local_store.OStype ===  OSTYPEenum.Windows ? 
                  <HeaderWindows toggleSettings={toggleSettings}/>
                  :
                  local_store.OStype ===  OSTYPEenum.macOS ? 
                  <HeaderMacOS toggleSettings={toggleSettings}/> 
                  :
                  <HeaderLinuxOS toggleSettings={toggleSettings}/>
              }
              <div className="main_app_container">
                <div className="left_sidebar">
                  <LeftSidebar />
                </div>
                <div className="center_activity">
                      <AnimatePresence>
                        <Routes>
                              <Route path="/" element={<AllTracks/>}/>
                              <Route path="/AllArtists" element={<AllArtists/>}/>
                              <Route path="/AllAlbums" element={<AllAlbums/>}/>
                              <Route path="/AllGenres" element={<AllGenres/>}/>
                              <Route path="/AllPlaylists" element={<AllPlaylists/>}/>
                              <Route path="/SearchPage" element={<SearchPage/>}/>
                              <Route path="/AlbumDetails/:album_key/:artist_name" element={<AlbumDetails/>}/>
                              <Route path="/ArtistCatalogue/:artist_name" element={<ArtistCatalogue/>}/>
                              <Route path="/GenreView/:genre_key" element={<GenreView/>}/>
                              <Route path="/PlaylistView/:playlist_key" element={<PlaylistView/>}/>
                        </Routes>
                      </AnimatePresence>
                </div>
              </div>
                <AppMusicPlayer openPlayer={openPlayer} toggleFloatingHNState={toggleFloatingHNState} openMiniPlayer={ToggleMiniPlayer}/>
                <Settings openSettings={openSettings} closeSettings={closeSetting}/>
                <FSMusicPlayer openPlayer={FSplayerState} closePlayer={closePlayer}/>
                <HistoryNextFloating FloatingHNState={FloatingHNState} toggleFloatingHNState={toggleFloatingHNState}/>
                <NotifyBottomRight/>
            </div>
        </div>
      </Router>
      :
      <MiniPlayer isOpen={openMiniPlayer} closeMiniPlayer={ToggleMiniPlayer}/>
    }
    </>
  );
}

export default App
