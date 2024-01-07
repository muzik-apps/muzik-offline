import { Edit, Play, Shuffle } from "@assets/icons";
import { LargeResizableCover, RectangleSongBox, GeneralContextMenu, EditPlaylistModal, PropertiesModal, AddSongToPlaylistModal } from "@components/index";
import { local_albums_db, local_playlists_db } from "@database/database";
import { contextMenuButtons, contextMenuEnum } from "types";
import { motion } from "framer-motion";
import { useReducer, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistSongs, secondsToTimeFormat } from "utils";
import "@styles/pages/PlaylistView.scss";
import { ViewportList } from "react-viewport-list";
import { variants_list } from "@content/index";
import { PlaylistViewState, playlistViewReducer } from "store/reducerStore";
import { reducerType } from "store";
import { addThisSongToPlayNext, addThisSongToPlayLater, playThisListNow, startPlayingNewSong } from "utils/playerControl";
import { closeContextMenu, setSongList, selectThisSong, closePlaylistModal } from "utils/reducerUtils";

const PlaylistView = () => {
    const [state , dispatch] = useReducer(playlistViewReducer, PlaylistViewState);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const { playlist_key } = useParams(); 
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

    function handleScroll(){
        const scrollY = itemsHeightRef.current?.scrollTop ?? 0;
        // NOTE: The following console.log might affect the timing of the code execution.
        // If you experience issues with state updates, it's recommended to investigate
        // potential asynchronous behavior and consider removing or adjusting this log.
        console.log;
        if(scrollY === 0)dispatch({ type: reducerType.SET_RESIZE_HEADER, payload: false});
        else if(state.resizeHeader === false)dispatch({ type: reducerType.SET_RESIZE_HEADER, payload: true});
    };

    async function closeModalAndResetData(){
        dispatch({ type: reducerType.SET_EDIT_PLAYLIST_MODAL, payload: false});
        const playlistres = await local_playlists_db.playlists.where("key").equals(state.playlist_metadata.key).toArray();
        if(playlistres.length !== 1)return;
        dispatch({ type: reducerType.SET_PLAYLIST_METADATA, payload: {
            key: state.playlist_metadata.key,
            cover: playlistres[0].cover, playlistName: playlistres[0].title,
            song_count: state.playlist_metadata.song_count,
            length: state.playlist_metadata.length
            }
        });
    }

    async function setPlaylistSongs(){
        if(playlist_key === undefined)return;
        const playlistres = await local_playlists_db.playlists.where("key").equals(Number.parseInt(playlist_key)).toArray();
        if(playlistres.length !== 1)return;
        const result = await getPlaylistSongs(playlistres[0]);
        dispatch({ type: reducerType.SET_PLAYLIST_METADATA, payload: {
            key: playlistres[0].key,
            cover: playlistres[0].cover, playlistName: playlistres[0].title,
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
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).toArray();
            navigate(`/AlbumDetails/${albumres[0].key}/undefined`);
        }
        else if(type === "artist"){
            navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        }
    }

    useEffect(() => {
        setPlaylistSongs();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <motion.div className="PlaylistView"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={playlist_key} resizeHeader={state.resizeHeader} cover={state.playlist_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: state.resizeHeader ? "25px" : "68px" }}>{state.playlist_metadata.playlistName}</h2>
                    { !state.resizeHeader &&
                        <>
                            <h4>{state.playlist_metadata.song_count} songs</h4>
                            <div className="action_buttons">
                                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => playThisSong(-1)}>
                                    <Play /><p>play</p>
                                </motion.div>
                                <motion.div className="ShuffleIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => playThisSong(-1, true)}>
                                    <Shuffle /><p>Shuffle</p>
                                </motion.div>
                                <motion.div className="EditIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} 
                                onClick={() => dispatch({ type: reducerType.SET_EDIT_PLAYLIST_MODAL, payload: true})}>
                                    <Edit /><p>Edit</p>
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
                <ViewportList viewportRef={itemsHeightRef} items={state.SongList}>
                    {
                        (song, index) => (
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
                                playThisSong={(_key: number,) => {}}/>
                        )
                    }
                </ViewportList>
                <div className="footer_content">
                    <h4>{state.playlist_metadata.song_count} {state.playlist_metadata.song_count > 1 ? "Songs" : "Song"}, {state.playlist_metadata.length} listen time</h4>
                </div>
            </motion.div>
            {
                state.songMenuToOpen && (
                    <div className="PlaylistView-ContextMenu-container" 
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
            <EditPlaylistModal 
                playlistobj={{key: state.playlist_metadata.key, cover: state.playlist_metadata.cover, title: state.playlist_metadata.playlistName, dateCreated: "", dateEdited: "", tracksPaths: []}}
                isOpen={state.isEditingPlayListModalOpen} closeModal={closeModalAndResetData}/>
            <AddSongToPlaylistModal isOpen={state.isPlaylistModalOpen} songPath={state.songMenuToOpen ? state.songMenuToOpen.path : ""} closeModal={() => closePlaylistModal(dispatch)} />
            <PropertiesModal isOpen={state.isPropertiesModalOpen} song={state.songMenuToOpen ? state.songMenuToOpen : undefined} closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default PlaylistView