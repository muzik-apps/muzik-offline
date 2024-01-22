import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu, LoaderAnimated, AddSongsToPlaylistModal } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllGenres.scss";
import { contextMenuEnum, contextMenuButtons } from "@muziktypes/index";
import { local_genres_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { AllGenresState, allGenreReducer } from '@store/reducerStore';
import { reducerType } from "@store/index";
import { closeContextMenu, closePlaylistModal, setOpenedDDM } from "@utils/reducerUtils";
import { addTheseSongsToPlayLater, addTheseSongsToPlayNext, playTheseSongs } from "@utils/playerControl";

const AllGenres = () => {
    const [state , dispatch] = useReducer(allGenreReducer, AllGenresState);
    const navigate = useNavigate();

    function selectOption(arg: string){
        dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
        const matching_genre = state.genreList.find(genre => { return genre.key === key; });
        dispatch({ type: reducerType.SET_GENRE_MENU, payload: matching_genre ? matching_genre : null });
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowGenre && state.genreMenuToOpen)navigateTo(state.genreMenuToOpen.key);
        else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
        else if(arg === contextMenuButtons.PlayNext && state.genreMenuToOpen){ 
            addTheseSongsToPlayNext({genre: state.genreMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.PlayLater && state.genreMenuToOpen){ 
            addTheseSongsToPlayLater({genre: state.genreMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
        else if(arg === contextMenuButtons.Play && state.genreMenuToOpen){
            playTheseSongs({genre: state.genreMenuToOpen.title});
            closeContextMenu(dispatch); 
        }
    }

    function navigateTo(passed_key: string){ navigate(`/GenreView/${passed_key}`); }

    function setList(){
        dispatch({ type: reducerType.SET_LOADING, payload: true});
        local_genres_db.genres.toArray().then((list) =>{
            dispatch({ type: reducerType.SET_LOADING, payload: false});
            if(state.sort.aToz === "Descending")list = list.reverse();
            dispatch({ type: reducerType.SET_GENRE_LIST, payload: list });
        });
    }

    useEffect(() => { setList(); }, [state.sort])
    
    return (
        <motion.div className="AllGenres"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllGenres_title">
                <h1>All genres</h1>
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
            {state.genreList.length === 0 && state.isloading === false && (
                <h6>
                    it seems like you may not have added any songs yet.<br/>
                    To add songs, click on the settings button above, scroll down <br/>
                    and click on "click here to change directories". <br/>
                </h6>
            )}
            { state.isloading && <LoaderAnimated /> }
            <div className="AllGenres_container">
                    {state.genreList.map((genre) =>
                        <SquareTitleBox 
                        key={genre.key}
                        cover={genre.cover} 
                        title={genre.title}
                        keyV={genre.key}
                        navigateTo={navigateTo}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
            </div>
            {
                state.genreMenuToOpen && (
                    <div className="AllGenres-ContextMenu-container" 
                        onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
                        <GeneralContextMenu 
                            xPos={state.co_ords.xPos} 
                            yPos={state.co_ords.yPos} 
                            title={state.genreMenuToOpen.title} 
                            CMtype={contextMenuEnum.GenreCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
            <AddSongsToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                title={state.genreMenuToOpen? state.genreMenuToOpen.title : ""} 
                values={{genre: state.genreMenuToOpen? state.genreMenuToOpen.title : ""}}
                closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default AllGenres