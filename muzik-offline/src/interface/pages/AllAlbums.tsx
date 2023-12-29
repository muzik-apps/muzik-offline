import { motion } from "framer-motion";
import { useEffect, useReducer } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllAlbums.scss";
import { contextMenuEnum, contextMenuButtons } from "types";
import { useNavigate } from "react-router-dom";
import { AllAlbumsState, allAlbumsReducer } from "store/reducerStore";
import { reducerType } from "store";
import { closeContextMenu, setOpenedDDM } from "utils/reducerUtils";
import { local_albums_db } from "@database/database";

const AllAlbums = () => {
    const [state , dispatch] = useReducer(allAlbumsReducer, AllAlbumsState);
    const navigate = useNavigate();

    function selectOption(arg: string){
        dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: state.sort.by}});
        dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
        const matching_album = state.albumList.find(album => { return album.key === key; });
        dispatch({ type: reducerType.SET_ALBUM_MENU, payload: matching_album ? matching_album : null });
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowAlbum && state.albumMenuToOpen){
            navigateTo(state.albumMenuToOpen.key);
        }
    }

    function navigateTo(key: number){ navigate(`/AlbumDetails/${key}/undefined`); }

    useEffect(() => {
        const setList = async() => {
            let list = await local_albums_db.albums.orderBy(state.sort.by).toArray();
            if(state.sort.aToz === "Descending")list = list.reverse();
            dispatch({ type: reducerType.SET_ALBUM_LIST, payload: list });
        }
        setList();

    }, [state.sort])
    
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
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(state.openedDDM === "aToz" ? null : "aToz", dispatch)}>
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
                state.albumMenuToOpen && (
                    <div className="AllAlbums-ContextMenu-container" onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
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
        </motion.div>
    )
}

export default AllAlbums