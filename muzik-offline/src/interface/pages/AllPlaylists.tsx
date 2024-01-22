import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu, CreatePlaylistModal, PropertiesModal, LoaderAnimated, AddSongsToPlaylistModal } from "@components/index";
import { ChevronDown, Menu } from "@assets/icons";
import "@styles/pages/AllPlaylists.scss";
import { contextMenuButtons, contextMenuEnum } from '@muziktypes/index';
import { local_playlists_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { AllPlaylistsState, allPlaylistsReducer } from "@store/reducerStore";
import { reducerType } from "@store/index";
import { closeContextMenu, closePlaylistModal, closePropertiesModal, setOpenedDDM } from "@utils/reducerUtils";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs } from "@utils/playerControl";

const AllPlaylists = () => {
    const [state , dispatch] = useReducer(allPlaylistsReducer, AllPlaylistsState);
    const navigate = useNavigate();

    function selectOption(arg: string){
        dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
        const matching_playlist = state.playlistList.find(playlist => { return playlist.key === Number.parseInt(key); });
        dispatch({ type: reducerType.SET_PLAYLIST_MENU, payload: matching_playlist ? matching_playlist : null });
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.ShowInfo){ dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: true}); }
        else if(arg == contextMenuButtons.ShowPlaylist && state.playlistMenuToOpen)navigateTo(state.playlistMenuToOpen.key.toString());
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.playlistMenuToOpen){ 
            addTheseSongsToPlayNext({playlist: state.playlistMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.playlistMenuToOpen){ 
            addTheseSongsToPlayLater({playlist: state.playlistMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.Play && state.playlistMenuToOpen){
            playTheseSongs({playlist: state.playlistMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
    }

    function navigateTo(passed_key: string){ navigate(`/PlaylistView/${passed_key}`); }

    function setList(){
        dispatch({ type: reducerType.SET_LOADING, payload: true});
        local_playlists_db.playlists.toArray().then((list) =>{
            dispatch({ type: reducerType.SET_LOADING, payload: false});
            if(state.sort.aToz === "Descending")list = list.reverse();
            dispatch({ type: reducerType.SET_PLAYLIST_LIST, payload: list });
        });
    }

    useEffect(() => { setList(); }, [state.sort])
    
    return (
        <motion.div className="AllPlaylists"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllPlaylists_title">
                <h1>All playlists</h1>
                <div className="sort_selector">
                    <h2>Sort A-Z: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} 
                        onClick={() => setOpenedDDM(state.openedDDM === "aToz" ? null : "aToz", dispatch)}>
                            <h4>{state.sort.aToz}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: state.openedDDM ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Ascending", "Descending"]} 
                                isOpen={(state.openedDDM ? true : false)}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
                <motion.div className="create_playlist" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} 
                    onClick={() => dispatch({ type: reducerType.SET_CREATE_PLAYLIST_MODAL, payload: true})}>
                    <h4>create a playlist</h4>
                    <Menu />
                </motion.div>
            </div>
            {state.playlistList.length === 0 && state.isloading === false && (
                <h6>
                    you have no playlists
                </h6>
            )}
            { state.isloading && <LoaderAnimated /> }
            <div className="AllPlaylists_container">
                    {state.playlistList.map((playlist) =>
                        <SquareTitleBox 
                        key={playlist.key}
                        cover={playlist.cover} 
                        title={playlist.title}
                        keyV={playlist.key.toString()}
                        navigateTo={navigateTo}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
            </div>
            {
                state.playlistMenuToOpen && (
                    <div className="AllPlaylists-ContextMenu-container" 
                        onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
                        <GeneralContextMenu 
                            xPos={state.co_ords.xPos} 
                            yPos={state.co_ords.yPos} 
                            title={state.playlistMenuToOpen.title}
                            CMtype={contextMenuEnum.PlaylistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
            <CreatePlaylistModal isOpen={state.isCreatePlaylistModalOpen} closeModal={() => dispatch({ type: reducerType.SET_CREATE_PLAYLIST_MODAL, payload: false})}/>
            <PropertiesModal isOpen={state.isPropertiesModalOpen} playlist={state.playlistMenuToOpen ? state.playlistMenuToOpen : undefined} closeModal={() => closePropertiesModal(dispatch)}/>
            <AddSongsToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                title={state.playlistMenuToOpen? state.playlistMenuToOpen.title : ""} 
                values={{playlist: state.playlistMenuToOpen? state.playlistMenuToOpen.title : ""}}
                closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default AllPlaylists