import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu, AddSongsToPlaylistModal } from "@components/index";
import { ChevronDown, FolderPlus } from "@assets/icons";
import "@styles/pages/AllGenres.scss";
import { contextMenuEnum, contextMenuButtons } from "@muziktypes/index";
import { local_genres_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { AllGenresState, allGenreReducer } from '@store/reducerStore';
import { reducerType } from "@store/index";
import { closeContextMenu, closePlaylistModal, openFileDialogDND, processDragEvents, setOpenedDDM } from "@utils/reducerUtils";
import { addTheseSongsToPlayLater, addTheseSongsToPlayNext, playTheseSongs } from "@utils/playerControl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const AllGenres = () => {
    const [state , dispatch] = useReducer(allGenreReducer, AllGenresState);
    const navigate = useNavigate();

    function selectOption(arg: string){
        dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
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

    function navigateTo(passed_key: number){ navigate(`/GenreView/${passed_key}`); }

    function setList(){
        dispatch({ type: reducerType.SET_LOADING, payload: true});
        local_genres_db.genres.toArray().then((list) =>{
            dispatch({ type: reducerType.SET_LOADING, payload: false});
            if(state.sort.aToz === "Descending")list = list.reverse();
            dispatch({ type: reducerType.SET_GENRE_LIST, payload: list });
        });
    }

    useEffect(() => { processDragEvents(dispatch); }, [state]);

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
                <div className="skeleton-loading">
                    <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" duration={2}>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                    </SkeletonTheme> 
                </div>}
            { state.genreList.length !== 0 && 
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
                        <div className="bottom_margin"/>
                </div>
            }
            {
                state.genreMenuToOpen && state.co_ords.xPos != 0 && state.co_ords.yPos != 0 && (
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
            {state.genreList.length !== 0 && <div className="bottom_margin"/>}
            <AddSongsToPlaylistModal 
                isOpen={state.isPlaylistModalOpen} 
                title={state.genreMenuToOpen? state.genreMenuToOpen.title : ""} 
                values={{genre: state.genreMenuToOpen? state.genreMenuToOpen.title : ""}}
                closeModal={() => closePlaylistModal(dispatch)} />
        </motion.div>
    )
}

export default AllGenres