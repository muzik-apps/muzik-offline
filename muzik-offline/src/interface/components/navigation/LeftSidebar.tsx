import {Microphone, MusicalNote, LayersThree, Disk, Menu } from "@icons/index";
import { AppNavigator } from "@components/index";
import "@styles/components/navigation/LeftSidebar.scss";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSavedObjectStore, useViewableSideElStore } from "@store/index";

const LeftSidebar = () => {
    const {local_store } = useSavedObjectStore((state) => { return { local_store: state.local_store}; });
    const {viewableEl} = useViewableSideElStore((state) => { return { viewableEl: state.viewableEl}; });
    const [selectedPanel, setSelectedPanel] = useState<string>(local_store.LaunchTab);
    const navigate = useNavigate();
    const location = useLocation();

    function setSelectedPanelF(arg: string){
        setSelectedPanel(arg);
        if(arg === "All tracks")navigate("/");
        else if(arg === "All artists")navigate("/AllArtists");
        else if(arg === "All albums")navigate("/AllAlbums");
        else if(arg === "All genres")navigate("/AllGenres");
        else if(arg === "All playlists")navigate("/AllPlaylists");
        else navigate("/");
    }

    useEffect(() => {
        const loadLaunchPage = () => { setSelectedPanelF(selectedPanel); }
        loadLaunchPage();
    }, [])

    useEffect(() => {
        const selectPanel = () => {
            const pn: string = location.pathname;
            if(pn === "/" && selectedPanel !== "All tracks")setSelectedPanel("All tracks");
            else if(pn === "/AllArtists" && selectedPanel !== "All artists")setSelectedPanel("All artists");
            else if(pn === "/AllAlbums" && selectedPanel !== "All albums")setSelectedPanel("All albums");
            else if(pn === "/AllGenres" && selectedPanel !== "All genres")setSelectedPanel("All genres");
            else if(pn === "/AllPlaylists" && selectedPanel !== "All playlists")setSelectedPanel("All playlists");
            else if(pn === "/SearchPage")setSelectedPanel("null");
            else ;
        }

        selectPanel();
    }, [location]);

    return (
        <div className="LeftSidebar">
            <div className="user_library">
                <h1>Library</h1>
                {viewableEl.All_tracks && 
                    <AppNavigator icon={MusicalNote} text={"All tracks"} selected_panel={selectedPanel} setSelectedPanelF={setSelectedPanelF}/>}
                {viewableEl.All_artists && 
                    <AppNavigator icon={Microphone} text={"All artists"} selected_panel={selectedPanel} setSelectedPanelF={setSelectedPanelF}/>}
                {viewableEl.All_albums &&
                    <AppNavigator icon={LayersThree} text={"All albums"} selected_panel={selectedPanel} setSelectedPanelF={setSelectedPanelF}/>}
                {viewableEl.All_genres &&
                    <AppNavigator icon={Disk} text={"All genres"} selected_panel={selectedPanel} setSelectedPanelF={setSelectedPanelF}/>}
                {viewableEl.All_playlists &&
                    <AppNavigator icon={Menu} text={"All playlists"} selected_panel={selectedPanel} setSelectedPanelF={setSelectedPanelF}/>}
            </div>
        </div>
    )
}

export default LeftSidebar