import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu, LoaderAnimated, AddSongsToPlaylistModal } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllAlbums.scss";
import { contextMenuEnum, contextMenuButtons } from "@muziktypes/index";
import { useNavigate } from "react-router-dom";
import { AllAlbumsState, allAlbumsReducer } from "@store/reducerStore";
import { reducerType } from "@store/index";
import { closeContextMenu, closePlaylistModal, setOpenedDDM } from "@utils/reducerUtils";
import { local_albums_db } from "@database/database";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs } from "@utils/playerControl";

const AllAlbums = () => {
    const [state , dispatch] = useReducer(allAlbumsReducer, AllAlbumsState);
    const navigate = useNavigate();

    function selectOption(arg: string){
        dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
        const matching_album = state.albumList.find(album => { return album.key === key; });
        dispatch({ type: reducerType.SET_ALBUM_MENU, payload: matching_album ? matching_album : null });
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowAlbum && state.albumMenuToOpen){navigateTo(state.albumMenuToOpen.key);}
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.albumMenuToOpen){ 
            addTheseSongsToPlayNext({album: state.albumMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.albumMenuToOpen){ 
            addTheseSongsToPlayLater({album: state.albumMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.Play && state.albumMenuToOpen){
            playTheseSongs({album: state.albumMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
    }

    function navigateTo(key: string){ navigate(`/AlbumDetails/${key}/undefined`); }

    function setList(){
        dispatch({ type: reducerType.SET_LOADING, payload: true});
        local_albums_db.albums.toArray().then((list) =>{
            dispatch({ type: reducerType.SET_LOADING, payload: false});
            if(state.sort.aToz === "Descending")list = list.reverse();
            dispatch({ type: reducerType.SET_ALBUM_LIST, payload: list });
        });
    }

    useEffect(() => { setList(); }, [state.sort])
    
    return (
        <motion.div className="AllAlbums"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllAlbums_title">
                <h1>All albums</h1>
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
            </div>
            {state.albumList.length === 0 && state.isloading === false && (
                <h6>
                    it seems like you may not have added any songs yet.<br/>
                    To add songs, click on the settings button above, scroll down <br/>
                    and click on "click here to change directories". <br/>
                </h6>
            )}
            { state.isloading && <LoaderAnimated /> }
            <div className="AllAlbums_container">
                {state.albumList.map((album) => 
                    <SquareTitleBox 
                    key={album.key}
                    cover={album.cover} 
                    title={album.title}
                    keyV={album.key}
                    navigateTo={navigateTo}
                    setMenuOpenData={setMenuOpenData}/>
                )}
            </div>
            {
                state.albumMenuToOpen && state.co_ords.xPos != 0 && state.co_ords.yPos != 0 && (
                    <div className="AllAlbums-ContextMenu-container" 
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
            <div className="bottom_margin"/>
            <AddSongsToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                title={state.albumMenuToOpen? state.albumMenuToOpen.title : ""} 
                values={{album: state.albumMenuToOpen? state.albumMenuToOpen.title : ""}}
                closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default AllAlbums