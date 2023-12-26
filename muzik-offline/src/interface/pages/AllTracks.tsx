import { Song, contextMenuButtons, contextMenuEnum } from "types";
import { motion } from "framer-motion";
import { useRef, useEffect, useReducer } from "react";
import { ChevronDown, Shuffle } from "@assets/icons";
import { AddSongToPlaylistModal, DropDownMenuSmall, GeneralContextMenu, PropertiesModal, RectangleSongBox } from "@components/index";
import { ViewportList } from 'react-viewport-list';
import { local_albums_db, local_songs_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { AllTracksState, alltracksReducer, reducerType } from "store";
import { addThisSongToPlayLater, addThisSongToPlayNext, playThisListNow } from "utils";
import "@styles/pages/AllTracks.scss";
import playerState from "store/playerState";

const AllTracks = () => {
    const [state , dispatch] = useReducer(alltracksReducer, AllTracksState);
    const {startPlayingNewSong} = playerState();
    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement | null>(null);

    function selectThisSong(index: number){ dispatch({ type: reducerType.SET_SELECTED, payload: index }); }

    function selectOption(arg: string){
        if(state.openedDDM === "aToz" && arg !== state.sort.aToz)dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        if(state.openedDDM === "by" && arg !== state.sort.by)dispatch({ type: reducerType.SET_SORT, payload: {aToz: state.sort.aToz, by: arg}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords});
        const matching_song = state.SongList.find(song => { return song.id === key; });
        dispatch({ type: reducerType.SET_SONG_MENU, payload: matching_song ? matching_song : null});
    }

    function chooseOption(arg: contextMenuButtons, songToPlay?: Song){
        if(arg === contextMenuButtons.ShowInfo){ dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.songMenuToOpen){ 
            addThisSongToPlayNext(state.songMenuToOpen);
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.songMenuToOpen){ 
            addThisSongToPlayLater(state.songMenuToOpen);
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.Play && (state.songMenuToOpen || songToPlay)){
            //in the songlist, get the next 20 songs from the songmenutotopen key
            const smTo = state.songMenuToOpen ? state.songMenuToOpen : songToPlay;
            if(!smTo)return;
            const index = state.SongList.findIndex(song => song.id === smTo.id);
            if(index === -1)return;
            playThisListNow(state.SongList.slice(index, index + 20));
            closeContextMenu(); 
        }
    }

    async function playThisSong(key: number){
        const matching_song = state.SongList.find(song => { return song.id === key; });
        if(!matching_song)return;
        await startPlayingNewSong(matching_song);
        chooseOption(contextMenuButtons.Play, matching_song);
    }

    function closeContextMenu(e?: React.MouseEvent<HTMLDivElement, MouseEvent>){
        if(e){
            if(e.target !== e.currentTarget)return;
            e.preventDefault();
        }
        dispatch({ type: reducerType.SET_SONG_MENU, payload: null});
        dispatch({ type: reducerType.SET_COORDS, payload: {xPos: 0, yPos: 0}});
    }

    async function navigateTo(key: number, type: "artist" | "song"){
        const relatedSong = state.SongList.find((value) => value.id === key);
        if(!relatedSong)return;
        if(type === "song"){
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).toArray();
            navigate(`/AlbumDetails/${albumres[0].key}/undefined`);
        }
        else if(type === "artist")navigate(`/ArtistCatalogue/${relatedSong.artist}`);
    }

    useEffect(() => {
        const setList = async() => {
            let list: Song[] = [];
            if(state.sort.aToz === "Ascending")list = await local_songs_db.songs.orderBy(state.sort.by).toArray();//sort in ascending order
            else if(state.sort.aToz === "Descending")list = await local_songs_db.songs.orderBy(state.sort.by).reverse().toArray();//sort in descending order
            dispatch({ type: reducerType.SET_SONG_LIST, payload: list});
        }

        setList();
    }, [state.sort])
    
    return (
        <motion.div className="AllTracks"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllTracks_title">
                <h1>All tracks</h1>
                <div className="sort_selector">
                    <h2>Sort by: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => dispatch({ type: reducerType.SET_OPENED_DDM, payload: state.openedDDM === "by" ? null : "by"})}>
                            <h4>{state.sort.by}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: state.openedDDM === "by" ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["name", "title", "artist", "album", "duration_seconds", "year", "file_size"]} 
                                isOpen={(state.openedDDM === "by")}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
                <div className="sort_selector">
                    <h2>Sort A-Z: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() =>  dispatch({ type: reducerType.SET_OPENED_DDM, payload: state.openedDDM === "aToz" ? null : "aToz"})}>
                            <h4>{state.sort.aToz}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: state.openedDDM === "aToz" ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Ascending", "Descending"]} 
                                isOpen={(state.openedDDM === "aToz")}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
                <motion.div className="shuffle-btn" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}}>
                    <h4>shuffle & play</h4>
                    <Shuffle />
                </motion.div>
            </div>
            <div className="AllTracks_container" ref={ref}>
                <ViewportList viewportRef={ref} items={state.SongList}>
                    {(song, index) => (
                        <RectangleSongBox 
                            key={song.id}
                            keyV={song.id}
                            index={index + 1} 
                            cover={song.cover} 
                            songName={song.name} 
                            artist={song.artist}
                            length={song.duration} 
                            year={song.year}
                            selected={state.selected === index + 1 ? true : false}
                            navigateTo={navigateTo}
                            selectThisSong={selectThisSong}
                            setMenuOpenData={setMenuOpenData}
                            playThisSong={playThisSong}/>
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                state.songMenuToOpen && (
                    <div className="AllTracks-ContextMenu-container" onClick={closeContextMenu} onContextMenu={closeContextMenu}>
                        <GeneralContextMenu 
                            xPos={state.co_ords.xPos} 
                            yPos={state.co_ords.yPos} 
                            title={state.songMenuToOpen.name}
                            CMtype={contextMenuEnum.SongCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
            <PropertiesModal 
                isOpen={state.isPropertiesModalOpen} 
                song={state.songMenuToOpen!} 
                closeModal={() => {dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: false}); dispatch({ type: reducerType.SET_SONG_MENU, payload: null});}} />
            <AddSongToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                songPath={state.songMenuToOpen ? state.songMenuToOpen.path : ""} 
                closeModal={() => {dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: false}); dispatch({ type: reducerType.SET_SONG_MENU, payload: null});}} />
        </motion.div>
    )
}

export default AllTracks