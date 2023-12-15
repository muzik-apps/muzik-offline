import "@styles/App/App.scss";
import { AppMusicPlayer, LeftSidebar, FSMusicPlayer, HeaderLinuxOS, HeaderMacOS, HeaderWindows } from "@components/index";
import { AllGenres, AllPlaylists, AllTracks, Settings, SongAlbumDetails, 
  AllAlbums, AllArtists, SearchPage } from "@pages/index";
import { useEffect, useState } from "react";
import { type } from '@tauri-apps/api/os';
import { invoke } from '@tauri-apps/api/tauri';
import useLocalStorageState from "use-local-storage-state";
import { SavedDirectories, SavedObject, SavedWallpaper, emptyDirectories, emptySavedObject, emptyWallpaper } from "@database/index";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HistoryNextFloating } from "@layouts/index";
import { OSTYPEenum, Song } from "types";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [FSplayerState, setFSplayerState] = useState<boolean>(false);
  const [FloatingHNState, setFloatingHNState] = useState<boolean>(false);
  const [local_store, setStore] = useLocalStorageState<SavedObject>("SavedObject-offline", {defaultValue: emptySavedObject});
  const [wallpaper,] = useLocalStorageState<SavedWallpaper>("SavedWallpaper-offline", {defaultValue: emptyWallpaper});
  const [dir,] = useLocalStorageState<SavedDirectories>("directories", {defaultValue: emptyDirectories});
  const [, setSongList] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});

  function closeSetting(){if(openSettings === true)setOpenSettings(false);}

  function toggleSettings(){setOpenSettings(!openSettings);}

  function openPlayer(){setFSplayerState(true);}

  function closePlayer(){setFSplayerState(false);}

  function toggleFloatingHNState(){setFloatingHNState(!FloatingHNState);}

  function detectKeyPress(this: Window, ev: any){
    if(ev.target.id !== "gsearch")console.log(ev.key);
  }

  useEffect(() => {
    const checkOSType = async() => {
      const osType = await type();
      setStore({ ... local_store, OStype : osType.toString()});
    }

    window.addEventListener("keydown", detectKeyPress);
    checkOSType();
    return () => {  window.removeEventListener("keydown", detectKeyPress); }
  }, [])

  useEffect(() => {
    const reloadSongs = () => {
      setSongList([]);
      invoke("get_all_songs", { pathsAsJsonArray: JSON.stringify(dir.Dir) })
        .then((message: any) => {
          console.log(JSON.parse(message));
          setSongList(JSON.parse(message));
        })
        .catch((error) => console.log(error));
    }

    reloadSongs();
  }, [dir])
  

  return (
    <Router>
      <div 
        className={"app_container " + (local_store.OStype ===  OSTYPEenum.Linux || !local_store.AppThemeBlur ? " linux-config " : "")} 
        data-theme={local_store.ThemeColour} 
        wallpaper-opacity={local_store.WallpaperOpacityAmount}
        onContextMenu={(e) => e.preventDefault()}>
          <div className={"background_img " + (wallpaper.DisplayWallpaper ? "" : local_store.BGColour)}>
            {wallpaper.DisplayWallpaper && (<img src={wallpaper.DisplayWallpaper} alt="wallpaper"/>)}
          </div>
          <div className={"app_darkness_layer " + (wallpaper.DisplayWallpaper ? "image_layer" : "color_layer")}>
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
                            <Route path="/SongAlbumDetails" element={<SongAlbumDetails/>}/>
                            <Route path="/SearchPage" element={<SearchPage/>}/>
                      </Routes>
                    </AnimatePresence>
              </div>
            </div>
            <div className="app_music_player_container">
              <AppMusicPlayer openPlayer={openPlayer} toggleFloatingHNState={toggleFloatingHNState}/>
            </div>
            <div className="app_settings">
              <Settings openSettings={openSettings} closeSettings={closeSetting}/>
            </div>
            <div className="fullscreen_music_player">
              <FSMusicPlayer openPlayer={FSplayerState} closePlayer={closePlayer}/>
            </div>
            <div className="lyrics_next_history">
              <HistoryNextFloating FloatingHNState={FloatingHNState} toggleFloatingHNState={toggleFloatingHNState}/>
            </div>
          </div>
      </div>
    </Router>
  );
}

export default App
