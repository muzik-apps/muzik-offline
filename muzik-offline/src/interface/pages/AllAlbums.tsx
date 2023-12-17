import { motion } from "framer-motion";
import { useState } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllAlbums.scss";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, album } from "types";
import { local_albums_db } from "@database/database";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";

const AllAlbums = () => {
    const [sort, setSort] = useState<string>("Ascending");
    const [openedDDM, setOpenedDDM] = useState<boolean>(false);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const albums = useLiveQuery(() => local_albums_db.albums.toArray()) ?? [];
    const [albumMenuToOpen, setAlbumMenuToOpen] = useState<album | null>(null);
    const navigate = useNavigate();

    function selectOption(arg: string){
        if(arg !== sort)setSort(arg); 
        setOpenedDDM(false);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_album = albums.find(album => { return album.key === key; });
        setAlbumMenuToOpen(matching_album ? matching_album : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    function navigateTo(key: number){ navigate("/AlbumDetails/" + key); }
    
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
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(!openedDDM)}>
                            <h4>{sort}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: openedDDM ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Ascending", "Descending"]} 
                                isOpen={openedDDM}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="AllAlbums_container">
                {albums.map((album) => 
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
                albumMenuToOpen && (
                    <div className="AllAlbums-ContextMenu-container" 
                    onClick={() => {
                        setAlbumMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setAlbumMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={albumMenuToOpen.title}
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