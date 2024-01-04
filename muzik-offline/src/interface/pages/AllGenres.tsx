import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllGenres.scss";
import { contextMenuEnum, contextMenuButtons } from "types";
import { local_genres_db } from "@database/database";
import { useNavigate } from "react-router-dom";
import { AllGenresState, allGenreReducer } from '../../store/reducerStore';
import { reducerType } from "store";
import { closeContextMenu, setOpenedDDM } from "utils/reducerUtils";

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
        if(arg === contextMenuButtons.AddToPlaylist){ console.log("Add to playlist"); }
        else if(arg === contextMenuButtons.PlayNext){ console.log("Play next"); }
        else if(arg === contextMenuButtons.PlayLater){ console.log("Play later"); }
        else if(arg === contextMenuButtons.Play){ console.log("Play"); }
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
        </motion.div>
    )
}

export default AllGenres