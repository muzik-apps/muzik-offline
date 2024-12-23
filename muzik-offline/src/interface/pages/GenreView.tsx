import { contextMenuButtons, contextMenuEnum } from "@muziktypes/index";
import { useEffect, useReducer, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGenreSongs, secondsToTimeFormat } from "utils";
import { motion } from "framer-motion";
import { AddSongToPlaylistModal, DeleteSongModal, EditPropertiesModal, GeneralContextMenu, LargeResizableCover, PropertiesModal, RectangleSongBox } from "@components/index";
import { Play, Shuffle } from "@assets/icons";
import { local_albums_db, local_genres_db } from "@database/database";
import "@styles/pages/GenreView.scss";
import { ViewportList } from "react-viewport-list";
import { GenreViewState, genreViewReducer } from "store/reducerStore";
import { variants_list } from "@content/index";
import { reducerType } from "store";
import { closeContextMenu, closeDeleteSongModal, closeEditPropertiesModal, closePlaylistModal, closePropertiesModal, processArrowKeysInput, selectThisSong, setSongList } from "utils/reducerUtils";
import { addThisSongToPlayLater, addThisSongToPlayNext, playThisListNow, startPlayingNewSong } from "utils/playerControl";

const GenreView = () => {
    const [state , dispatch] = useReducer(genreViewReducer, GenreViewState);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<any>(null);
    const navigate = useNavigate();
    const { genre_key } = useParams();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        const matching_song = state.SongList.find(song => { return song.id === key; });
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords});
        dispatch({ type: reducerType.SET_SONG_MENU, payload: matching_song ? matching_song : null});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.ShowInfo){ dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.EditSong){ dispatch({ type: reducerType.SET_EDIT_SONG_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.Delete){ dispatch({ type: reducerType.SET_DELETE_MODAL, payload: true}); }
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

    function handleScroll(){
        const scrollY = itemsHeightRef.current?.scrollTop ?? 0;
        // NOTE: The following console.log might affect the timing of the code execution.
        // If you experience issues with state updates, it's recommended to investigate
        // potential asynchronous behavior and consider removing or adjusting this log.
        console.log;
        if(scrollY === 0)dispatch({ type: reducerType.SET_RESIZE_HEADER, payload: false});
        else if(state.resizeHeader === false)dispatch({ type: reducerType.SET_RESIZE_HEADER, payload: true});
    };

    async function setAlbumSongs(){
        if(genre_key === undefined)return;
        const genreres = await local_genres_db.genres.where("key").equals(Number.parseInt(genre_key)).first();
        if(genreres === undefined)return;
        const result = await getGenreSongs(genreres);
        dispatch({ type: reducerType.SET_GENRE_METADATA, payload: {
            cover: result.cover, genreName: genreres.title,
            song_count: result.songs.length,
            length: secondsToTimeFormat(result.totalDuration)
            }
        });
        setSongList(result.songs, dispatch);
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
        setAlbumSongs();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <motion.div className="GenreView"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={genre_key} resizeHeader={state.resizeHeader} cover={state.genre_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: state.resizeHeader ? "25px" : "68px" }}>{state.genre_metadata.genreName}</h2>
                    { !state.resizeHeader &&
                        <>
                            <h4>{state.genre_metadata.song_count} {state.genre_metadata.song_count === 1 ? "Song" : "Songs"}</h4>
                            <div className="action_buttons">
                                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => playThisSong(-1)}>
                                    <Play />
                                    <p>play</p>
                                </motion.div>
                                <motion.div className="ShuffleIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => playThisSong(-1, true)}>
                                    <Shuffle />
                                    <p>Shuffle</p>
                                </motion.div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <motion.div className="main_content" 
                animate={state.resizeHeader ? "bigger" : "smaller"}
                variants={variants_list}
                transition={{ type: "tween" }}
                ref={itemsHeightRef}>
                <ViewportList viewportRef={itemsHeightRef} items={state.SongList} ref={listRef}>
                    {
                        (song, index) => (
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
                                playThisSong={(_key: number,) => {}}/>
                        )
                    }
                </ViewportList>
                <div className="footer_content">
                    <h4>{state.genre_metadata.song_count} {state.genre_metadata.song_count > 1 ? "Songs" : "Song"}, {state.genre_metadata.length} listen time</h4>
                </div>
            </motion.div>
            {
                state.songMenuToOpen && state.co_ords.xPos != 0 && state.co_ords.yPos != 0 && (
                    <div className="GenreView-ContextMenu-container" 
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
            <DeleteSongModal isOpen={state.isDeleteSongModalOpen} title={state.songMenuToOpen ? state.songMenuToOpen.name : ""} closeModal={(deleteSong) => closeDeleteSongModal(dispatch, state.songMenuToOpen, deleteSong)} />
        </motion.div>
    )
}

export default GenreView