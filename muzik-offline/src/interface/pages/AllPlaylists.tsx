import { motion } from "framer-motion";
import { useState } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllPlaylists.scss";
import { contextMenuEnum, mouse_coOrds, playlistDetails } from "types";
import { playlist1, playlist2, playlist3, playlist4, playlist5, playlist6, playlist7, playlist8 } from "@assets/index";

const playlists: playlistDetails[] = [
    {
        key: 1,
        cover: playlist1,
        title: "playlist 1",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 2,
        cover: playlist2,
        title: "playlist 2",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 3,
        cover: playlist3,
        title: "playlist 3",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 4,
        cover: playlist4,
        title: "playlist 4",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 5,
        cover: playlist5,
        title: "playlist 5",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 6,
        cover: playlist6,
        title: "playlist 6",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 7,
        cover: playlist7,
        title: "playlist 7",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 8,
        cover: playlist8,
        title: "playlist 8",
        dateCreated: new Date().toUTCString()
    }
]

const AllPlaylists = () => {

    const [sort, setSort] = useState<string>("Ascending");
    const [openedDDM, setOpenedDDM] = useState<boolean>(false);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [playlistMenuToOpen, setPlaylistMenuToOpen] = useState<playlistDetails | null>(null);

    function selectOption(arg: string){
        if(arg !== sort)setSort(arg); 
        setOpenedDDM(false);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_playlist = playlists.find(playlist => { return playlist.key === key; })
        setPlaylistMenuToOpen(matching_playlist ? matching_playlist : null);
    }
    
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
            <div className="AllPlaylists_container">
                {playlists.map((playlist) => 
                    <SquareTitleBox 
                        key={playlist.key}
                        cover={playlist.cover} 
                        title={playlist.title}
                        keyV={playlist.key}
                        setMenuOpenData={setMenuOpenData}
                    />)}
            </div>
            {
                playlistMenuToOpen && (
                    <div className="AllPlaylists-ContextMenu-container" 
                    onClick={() => {
                        setPlaylistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setPlaylistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={playlistMenuToOpen.title}
                            CMtype={contextMenuEnum.PlaylistCM}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
        </motion.div>
    )
}

export default AllPlaylists