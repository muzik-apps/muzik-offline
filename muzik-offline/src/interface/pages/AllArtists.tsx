import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu, LoaderAnimated, AddSongsToPlaylistModal } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllArtists.scss";
import { contextMenuEnum, contextMenuButtons } from '@muziktypes/index';
import { local_artists_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { reducerType } from "@store/index";
import { allArtistsReducer, AllArtistsState } from "@store/reducerStore";
import { closeContextMenu, closePlaylistModal, setOpenedDDM } from "@utils/reducerUtils";
import { addTheseSongsToPlayLater, addTheseSongsToPlayNext, playTheseSongs } from "@utils/playerControl";

const AllArtists = () => {
    const [state , dispatch] = useReducer(allArtistsReducer, AllArtistsState);
    const navigate = useNavigate();

    function selectOption(arg: string){
        dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
        const matching_artist = state.artistList.find(artist => { return artist.key === key; });
        dispatch({ type: reducerType.SET_ARTIST_MENU, payload: matching_artist ? matching_artist : null });
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowArtist && state.artistMenuToOpen)navigateTo(state.artistMenuToOpen.key);
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.artistMenuToOpen){ 
            addTheseSongsToPlayNext({artist: state.artistMenuToOpen.artist_name});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.artistMenuToOpen){ 
            addTheseSongsToPlayLater({artist: state.artistMenuToOpen.artist_name});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.Play && state.artistMenuToOpen){
            playTheseSongs({artist: state.artistMenuToOpen.artist_name});
            closeContextMenu(dispatch); 
        }
    }

    function navigateTo(key: string){ 
        const artist_to_go_to = state.artistList.find((value) => value.key == key);
        if(artist_to_go_to)navigate(`/ArtistCatalogue/${artist_to_go_to.artist_name}`); 
    }

    function setList(){
        dispatch({ type: reducerType.SET_LOADING, payload: true});
        local_artists_db.artists.toArray().then((list) =>{
            dispatch({ type: reducerType.SET_LOADING, payload: false});
            if(state.sort.aToz === "Descending")list = list.reverse();
            dispatch({ type: reducerType.SET_ARTIST_LIST, payload: list });
        });
    }

    useEffect(() => { setList(); }, [state.sort])
    
    return (
        <motion.div className="AllArtists"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllArtists_title">
                <h1>All artists</h1>
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
            {state.artistList.length === 0 && state.isloading === false && (
                <h6>
                    it seems like you may not have added any songs yet.<br/>
                    To add songs, click on the settings button above, scroll down <br/>
                    and click on "click here to change directories". <br/>
                </h6>
            )}
            { state.isloading && <LoaderAnimated /> }
            <div className="AllArtists_container">
                    {state.artistList.map((artist) => 
                        <SquareTitleBox 
                        key={artist.key}
                        cover={artist.cover} 
                        title={artist.artist_name}
                        keyV={artist.key}
                        navigateTo={navigateTo}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
            </div>
            {
                state.artistMenuToOpen && state.co_ords.xPos != 0 && state.co_ords.yPos != 0 && (
                    <div className="AllArtists-ContextMenu-container"  
                        onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
                        <GeneralContextMenu 
                            xPos={state.co_ords.xPos} 
                            yPos={state.co_ords.yPos} 
                            title={state.artistMenuToOpen.artist_name}
                            CMtype={contextMenuEnum.ArtistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
            <AddSongsToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                title={state.artistMenuToOpen? state.artistMenuToOpen.artist_name : ""} 
                values={{artist: state.artistMenuToOpen? state.artistMenuToOpen.artist_name : ""}}
                closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default AllArtists