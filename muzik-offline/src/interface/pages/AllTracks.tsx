import { contextMenuButtons, contextMenuEnum } from "@muziktypes/index";
import { motion } from "framer-motion";
import { useRef, useEffect, useReducer } from "react";
import { ChevronDown, FolderPlus, Shuffle } from "@assets/icons";
import { AddSongToPlaylistModal, DropDownMenuSmall, EditPropertiesModal, GeneralContextMenu, PropertiesModal, RectangleSongBox } from "@components/index";
import { ViewportList } from 'react-viewport-list';
import { local_albums_db, local_songs_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { AllTracksState, alltracksReducer, reducerType } from "store";
import { addThisSongToPlayLater, addThisSongToPlayNext, playThisListNow, startPlayingNewSong } from "utils/playerControl";
import "@styles/pages/AllTracks.scss";
import { closeContextMenu, closeEditPropertiesModal, closePlaylistModal, closePropertiesModal, openFileDialogDND, processArrowKeysInput, processDragEvents, selectSortOption, selectThisSong, setOpenedDDM, setSongList } from "utils/reducerUtils";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const AllTracks = () => {
    const [state , dispatch] = useReducer(alltracksReducer, AllTracksState);
    const navigate = useNavigate();
    const alltracksRef = useRef<any>(null);
    const listRef = useRef<any>(null);

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        const matching_song = state.SongList.find(song => { return song.id === key; });
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords});
        dispatch({ type: reducerType.SET_SONG_MENU, payload: matching_song ? matching_song : null});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.ShowInfo){ dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.EditSong){ dispatch({ type: reducerType.SET_EDIT_SONG_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.songMenuToOpen){ 
            addThisSongToPlayNext([state.songMenuToOpen.id]);
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.songMenuToOpen){ 
            addThisSongToPlayLater([state.songMenuToOpen.id]);
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.Play && state.songMenuToOpen){
            playThisSong(state.songMenuToOpen.id);
            closeContextMenu(dispatch); 
        }
    }

    async function playThisSong(key: number, shuffle_list: boolean = false){
        if(state.SongList.length === 0)return;
        let songkey = key;
        if(songkey === -1)songkey = state.SongList[0].id;
        const index = state.SongList.findIndex(song => song.id === songkey);
        if(index === -1)return;
        //get ids of songs from index of matching song to last song in list
        await startPlayingNewSong(state.SongList[index]);
        await playThisListNow(state.SongList.slice(index + 1).map(song => song.id), shuffle_list);
    }

    async function navigateTo(key: number, type: "artist" | "song"){
        const relatedSong = state.SongList.find((value) => value.id === key);
        if(!relatedSong)return;
        if(type === "song"){
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).first();
            if(albumres === undefined)return;
            navigate(`/AlbumDetails/${albumres.key}/undefined`);
        }
        else if(type === "artist")navigate(`/ArtistCatalogue/${relatedSong.artist}`);
    }

    function setList(){
        dispatch({ type: reducerType.SET_LOADING, payload: true});
        local_songs_db.songs.orderBy(state.sort.by).toArray().then((list) =>{
            dispatch({ type: reducerType.SET_LOADING, payload: false});
            if(state.sort.aToz === "Descending")list = list.reverse();//sort in descending order
            setSongList(list, dispatch);
        });
    }

    function keyBoardShortCuts(ev: any){
        if(ev.target.id !== "gsearch" && (ev.key === "ArrowUp" || ev.key === "ArrowDown")){
            processArrowKeysInput(ev, dispatch, state.selected, state.SongList.length);
            if(listRef.current)listRef.current.scrollToIndex({index: state.selected - 1, offset: 5});
        }
        else if(ev.target.id !== "gsearch" && state.selected >= 1 && state.selected <= state.SongList.length){
            dispatch({type: reducerType.SET_SONG_MENU, payload: state.SongList[state.selected - 1]});
            if(((ev.ctrlKey || ev.metaKey) && (ev.key === "p" || ev.key === "P" )) || ev.key === "Enter")chooseOption(contextMenuButtons.Play);
            else if((ev.ctrlKey || ev.metaKey) && (ev.key === "i" || ev.key === "I"))chooseOption(contextMenuButtons.ShowInfo);
            else if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "a" || ev.key === "A"))chooseOption(contextMenuButtons.AddToPlaylist);
            else if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "n" || ev.key === "N"))chooseOption(contextMenuButtons.PlayNext);
            else if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "l" || ev.key === "L"))chooseOption(contextMenuButtons.PlayLater);
        }
    }

    useEffect(() => {
        processDragEvents(dispatch);
        document.addEventListener("keydown", keyBoardShortCuts);
        return () => document.removeEventListener("keydown", keyBoardShortCuts);
    }, [state])

    useEffect(() => { setList(); }, [state.sort])
    
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
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(state.openedDDM === "by" ? null : "by", dispatch)}>
                            <h4>{state.sort.by}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: state.openedDDM === "by" ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["name", "title", "artist", "album", "year"]} 
                                isOpen={(state.openedDDM === "by")}
                                selectOption={(arg) => selectSortOption(state.sort, state.openedDDM, arg, dispatch)}
                            />
                        </div>
                    </div>
                </div>
                <div className="sort_selector">
                    <h2>Sort A-Z: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(state.openedDDM === "aToz" ? null : "aToz", dispatch)}>
                            <h4>{state.sort.aToz}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: state.openedDDM === "aToz" ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Ascending", "Descending"]} 
                                isOpen={(state.openedDDM === "aToz")}
                                selectOption={(arg) => selectSortOption(state.sort, state.openedDDM, arg, dispatch)}
                            />
                        </div>
                    </div>
                </div>
                <motion.div className="shuffle-btn" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => playThisSong(-1, true)}>
                    <h4>shuffle & play</h4>
                    <Shuffle />
                </motion.div>
            </div>
            <div className="AllTracks_container" ref={alltracksRef}>
                {state.SongList.length === 0 && state.isloading === false && (
                    <div className={"drag-drop-border" + (state.inDragDropRegion ? " drag-drop-border-hover" : "")}>
                        <FolderPlus />
                        { state.inDragDropRegion ? <h1>Drop it here!</h1> : <h1>Drag and drop your music folder here</h1> }
                        <p>or</p>
                        <motion.div className="add-folder-btn" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={openFileDialogDND}>
                            <h2>Browse folders</h2>
                        </motion.div>
                    </div>
                )}
                { state.isloading && 
                    <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" width={"calc(100% - 5px)"} height={50} borderRadius={20} duration={2}>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1} style={{marginBottom: "6px"}}/>
                        <Skeleton count={1}/>
                    </SkeletonTheme> }
                <ViewportList viewportRef={alltracksRef} items={state.SongList} ref={listRef}>
                    {(song, index) => (
                        <RectangleSongBox 
                            key={song.id}
                            keyV={song.id}
                            index={index + 1} 
                            cover={song.cover_uuid} 
                            songName={song.name} 
                            artist={song.artist}
                            length={song.duration} 
                            year={song.year}
                            selected={state.selected === index + 1 ? true : false}
                            navigateTo={navigateTo}
                            selectThisSong={(index) => selectThisSong(index, dispatch)}
                            setMenuOpenData={setMenuOpenData}
                            playThisSong={playThisSong}/>
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                state.songMenuToOpen && state.co_ords.xPos !== 0 && state.co_ords.yPos !== 0 && (
                    <div className="AllTracks-ContextMenu-container" 
                        onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
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
            <PropertiesModal isOpen={state.isPropertiesModalOpen} song={state.songMenuToOpen!} closeModal={() => closePropertiesModal(dispatch)} />
            <EditPropertiesModal isOpen={state.isEditingSongModalOpen} songID={state.songMenuToOpen ? state.songMenuToOpen.id : -1} closeModal={() => closeEditPropertiesModal(dispatch)} />
            <AddSongToPlaylistModal isOpen={state.isPlaylistModalOpen} songPath={state.songMenuToOpen ? state.songMenuToOpen.path : ""} closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default AllTracks