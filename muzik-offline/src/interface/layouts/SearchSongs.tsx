import { RectangleSongBox, GeneralContextMenu, AddSongToPlaylistModal, PropertiesModal, EditPropertiesModal } from "@components/index";
import { contextMenuEnum, contextMenuButtons } from "@muziktypes/index";
import { useRef, useEffect, useReducer } from "react";
import "@styles/layouts/SearchSongs.scss";
import { ViewportList } from 'react-viewport-list';
import { local_albums_db, local_songs_db } from "@database/database";
import { reducerType, useSearchStore } from "@store/index";
import { useNavigate } from "react-router-dom";
import { SearchSongsState, searchSongsReducer } from "@store/reducerStore";
import { addThisSongToPlayLater, addThisSongToPlayNext, playThisListNow, startPlayingNewSong } from "@utils/playerControl";
import { closeContextMenu, closeEditPropertiesModal, closePlaylistModal, closePropertiesModal, processArrowKeysInput, selectThisSong, setSongList } from "@utils/reducerUtils";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const SearchSongs = () => {
    const [state , dispatch] = useReducer(searchSongsReducer, SearchSongsState);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const ref = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<any>(null);
    const navigate = useNavigate();

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
        else if(type === "artist"){
            navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        }
    }
    
    function keyBoardShortCuts(ev: any){
        if(ev.target.id !== "gsearch" && (ev.key === "ArrowUp" || ev.key === "ArrowDown")){
            processArrowKeysInput(ev, dispatch, state.selected, state.SongList.length);
            if(listRef.current)listRef.current.scrollToIndex({index: state.selected - 1, offset: 5});
        }
        else if(ev.target.id !== "gsearch" && state.selected >= 1 && state.selected <= state.SongList.length){
            dispatch({type: reducerType.SET_SONG_MENU, payload: state.SongList[state.selected - 1]});
            if(((ev.ctrlKey || ev.metaKey) && (ev.key === "p" || ev.key === "P" )) || ev.key === "Enter")chooseOption(contextMenuButtons.Play);
            else if((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && (ev.key === "i" || ev.key === "I"))chooseOption(contextMenuButtons.ShowInfo);
            else if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "a" || ev.key === "A"))chooseOption(contextMenuButtons.AddToPlaylist);
            else if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "n" || ev.key === "N"))chooseOption(contextMenuButtons.PlayNext);
            else if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "l" || ev.key === "L"))chooseOption(contextMenuButtons.PlayLater);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", keyBoardShortCuts);
        return () => document.removeEventListener("keydown", keyBoardShortCuts);  
    }, [state])

    useEffect(() => {
        const resetSongLists = () => {
            dispatch({ type: reducerType.SET_LOADING, payload: true});
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
            local_songs_db.songs.filter(item => {return regex.test(item.name)}).toArray()
            .then((list) => {
                    setSongList(list, dispatch);
                    dispatch({ type: reducerType.SET_LOADING, payload: false});
                }
            );
        }

        resetSongLists();
    }, [query])

    return (
        <div className="SearchSongs">
            <div className="SearchSongs-container" ref={ref}>
                {state.SongList.length === 0 && state.isloading === false && (
                    <h6>no songs found that match "{query}"</h6>
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
                    </SkeletonTheme>  }
                <ViewportList viewportRef={ref} items={state.SongList} ref={listRef}>
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
                        selectThisSong={(index) => selectThisSong(index, dispatch)}
                        setMenuOpenData={setMenuOpenData}
                        navigateTo={navigateTo}
                        playThisSong={playThisSong}/>
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                state.songMenuToOpen && state.co_ords.xPos != 0 && state.co_ords.yPos != 0 && (
                    <div className="SearchSongs-ContextMenu-container" 
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
            <PropertiesModal isOpen={state.isPropertiesModalOpen} song={state.songMenuToOpen!} closeModal={() => closePropertiesModal(dispatch)} />
            <EditPropertiesModal isOpen={state.isEditingSongModalOpen} songID={state.songMenuToOpen ? state.songMenuToOpen.id : -1} closeModal={() => closeEditPropertiesModal(dispatch)} />
            <AddSongToPlaylistModal isOpen={state.isPlaylistModalOpen} songPath={state.songMenuToOpen ? state.songMenuToOpen.path : ""} closeModal={() => closePlaylistModal(dispatch)} />
        </div>
    )
}

export default SearchSongs
