import { RectangleSongBox, GeneralContextMenu, AddSongToPlaylistModal, PropertiesModal } from "@components/index";
import { contextMenuEnum, contextMenuButtons } from "types";
import { useRef, useEffect, useReducer } from "react";
import "@styles/layouts/SearchSongs.scss";
import { ViewportList } from 'react-viewport-list';
import { local_albums_db, local_songs_db } from "@database/database";
import { reducerType, useSearchStore } from "store";
import { useNavigate } from "react-router-dom";
import { SearchSongsState, searchSongsReducer } from "store/reducerStore";
import { addThisSongToPlayLater, addThisSongToPlayNext, playThisListNow, startPlayingNewSong } from "utils/playerControl";
import { closeContextMenu, closePlaylistModal, closePropertiesModal, selectThisSong, setSongList } from "utils/reducerUtils";

const SearchSongs = () => {
    const [state , dispatch] = useReducer(searchSongsReducer, SearchSongsState);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const ref = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        const matching_song = state.SongList.find(song => { return song.id === key; });
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords});
        dispatch({ type: reducerType.SET_SONG_MENU, payload: matching_song ? matching_song : null});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.ShowInfo){ dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.songMenuToOpen){ 
            addThisSongToPlayNext(state.songMenuToOpen.id);
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.songMenuToOpen){ 
            addThisSongToPlayLater(state.songMenuToOpen.id);
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
        const ids: number[] = state.SongList.slice(index + 1).map(song => song.id);
        await playThisListNow(ids, shuffle_list);
    }

    async function navigateTo(key: number, type: "artist" | "song"){
        const relatedSong = state.SongList.find((value) => value.id === key);
        if(!relatedSong)return;
        if(type === "song"){
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).toArray();
            navigate(`/AlbumDetails/${albumres[0].key}/undefined`);
        }
        else if(type === "artist"){
            navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        }
    }

    useEffect(() => {
        const resetSongLists = () => {
            local_songs_db.songs.where("name").startsWithIgnoreCase(query).toArray().then((list) => { setSongList(list, dispatch);;});
        }

        resetSongLists();
    }, [query])

    return (
        <div className="SearchSongs">
            <div className="SearchSongs-container" ref={ref}>
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
                        selectThisSong={(index) => selectThisSong(index, dispatch)}
                        setMenuOpenData={setMenuOpenData}
                        navigateTo={navigateTo}
                        playThisSong={playThisSong}/>
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                state.songMenuToOpen && (
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
            <AddSongToPlaylistModal isOpen={state.isPlaylistModalOpen} songPath={state.songMenuToOpen ? state.songMenuToOpen.path : ""} closeModal={() => closePlaylistModal(dispatch)} />
        </div>
    )
}

export default SearchSongs
