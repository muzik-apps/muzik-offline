import { Play, Shuffle } from "@assets/icons";
import { AddSongsToPlaylistModal, GeneralContextMenu, LargeResizableCover, SquareTitleBox } from "@components/index";
import { contextMenuButtons, contextMenuEnum } from "@muziktypes/index";
import { motion } from "framer-motion";
import { useRef, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { getArtistsAlbums, secondsToTimeFormat } from "utils";
import { useNavigate } from "react-router-dom";
import "@styles/pages/ArtistCatalogue.scss";
import { artistCatalogueReducer, ArtistCatalogueState } from "@store/reducerStore";
import { reducerType } from "@store/index";
import { closeContextMenu, closePlaylistModal } from "@utils/reducerUtils";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs, playSongsFromThisArtist } from "@utils/playerControl";

const ArtistCatalogue = () => {
    const [state , dispatch] = useReducer(artistCatalogueReducer, ArtistCatalogueState);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { artist_name } = useParams(); 

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        const matching_album = state.albumList.find(album => { return album.key === key; });
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords});
        dispatch({ type: reducerType.SET_ALBUM_MENU, payload: matching_album ? matching_album : null});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.ShowAlbum && state.albumMenuToOpen) navigateTo(state.albumMenuToOpen.key);
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.albumMenuToOpen){ 
            addTheseSongsToPlayNext({album: state.albumMenuToOpen.title, artist: state.artist_metadata.artistName});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.albumMenuToOpen){ 
            addTheseSongsToPlayLater({album: state.albumMenuToOpen.title, artist: state.artist_metadata.artistName});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.Play && state.albumMenuToOpen){
            playTheseSongs({album: state.albumMenuToOpen.title, artist: state.artist_metadata.artistName});
            closeContextMenu(dispatch); 
        }
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

    async function setArtistAlbums(){
        if(artist_name === undefined)return;
        const result = await getArtistsAlbums(artist_name);
        dispatch({type: reducerType.SET_ARTIST_METADATA, payload: {
            cover: result.cover,
            artistName: artist_name,
            album_count: result.albums.length,
            song_count: result.song_count,
            length: secondsToTimeFormat(result.totalDuration)
        }});
        dispatch({type: reducerType.SET_ALBUM_LIST, payload: result.albums});
    }

    function navigateTo(passed_key: string){ navigate(`/AlbumDetails/${passed_key}/${state.artist_metadata.artistName}`); }

    useEffect(() => {
        setArtistAlbums();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <motion.div className="ArtistCatalogue"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={"1"} resizeHeader={state.resizeHeader} cover={state.artist_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: state.resizeHeader ? "25px" : "68px" }}>{state.artist_metadata.artistName}</h2>
                    { !state.resizeHeader &&
                        <>
                            <h4>{state.artist_metadata.album_count} albums</h4>
                            <h4>{state.artist_metadata.song_count} songs</h4>
                            <div className="action_buttons">
                                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} 
                                onClick={() => playSongsFromThisArtist(false, state.artist_metadata.artistName)}>
                                    <Play />
                                    <p>play</p>
                                </motion.div>
                                <motion.div className="ShuffleIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} 
                                onClick={() => playSongsFromThisArtist(true, state.artist_metadata.artistName)}>
                                    <Shuffle />
                                    <p>Shuffle</p>
                                </motion.div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="main_content" ref={itemsHeightRef} style={{height: !state.resizeHeader ? "calc(100vh - 325px)" : "calc(100vh - 160px)"}}>
                {state.albumList.map((album) => 
                    <SquareTitleBox 
                    key={album.key}
                    cover={album.cover} 
                    title={album.title}
                    keyV={album.key}
                    navigateTo={navigateTo}
                    setMenuOpenData={setMenuOpenData}/>
                )}
                <div className="footer_content"/>
            </div>
            {
                state.albumMenuToOpen && state.co_ords.xPos != 0 && state.co_ords.yPos != 0 && (
                    <div className="ArtistCatalogue-ContextMenu-container" 
                        onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
                        <GeneralContextMenu 
                            xPos={state.co_ords.xPos} 
                            yPos={state.co_ords.yPos} 
                            title={state.albumMenuToOpen.title}
                            CMtype={contextMenuEnum.AlbumCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <AddSongsToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                title={state.albumMenuToOpen? state.albumMenuToOpen.title : ""} 
                values={{album: state.albumMenuToOpen? state.albumMenuToOpen.title : ""}}
                closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default ArtistCatalogue