import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { ChevronDown } from "@assets/icons";
import { DropDownMenuSmall, GeneralContextMenu, RectangleSongBox } from "@components/index";
import "@styles/pages/AllTracks.scss";
import useLocalStorageState from "use-local-storage-state";
import { ViewportList } from 'react-viewport-list';

const AllTracks = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [sort, setSort] = useState<{aToz: string, by: string}>({aToz: "Ascending", by: "Alphabetically"});
    const [openedDDM, setOpenedDDM] = useState<string | null>(null);
    const [SongList,] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});
    const [songMenuToOpen, setSongMenuToOpen] = useState< Song | null>(null);

    const ref = useRef<HTMLDivElement | null>(null);

    function selectThisSong(index: number){ setSelected(index); }

    function selectOption(arg: string){
        if(openedDDM === "aToz" && arg !== sort.aToz)setSort({...sort, aToz: arg}); 
        if(openedDDM === "by" && arg !== sort.by)setSort({...sort, by: arg}); 
        setOpenedDDM(null);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongList.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }
    
    return (
        <motion.div className="AllTracks"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllTracks_title">
                <h1>All tracks</h1>
                <div className="sort_selector">
                    <h2>Sort by: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(openedDDM === "by" ? null : "by")}>
                            <h4>{sort.by}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: openedDDM === "by" ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Alphabetically", "Date added", "Date created", "Title", "Artist", "Album", "Duration", "Plays"]} 
                                isOpen={(openedDDM === "by")}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
                <div className="sort_selector">
                    <h2>Sort A-Z: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(openedDDM === "aToz" ? null : "aToz")}>
                            <h4>{sort.aToz}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: openedDDM === "aToz" ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Ascending", "Descending"]} 
                                isOpen={(openedDDM === "aToz")}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="AllTracks_container" ref={ref}>
                <ViewportList viewportRef={ref} items={SongList}>
                    {(song, index) => (
                        <RectangleSongBox 
                        key={song.id}
                        keyV={song.id}
                        index={index + 1} 
                        cover={song.cover} 
                        songName={song.title} 
                        artist={song.artist}
                        length={song.duration} 
                        year={song.year}
                        selected={selected === index + 1 ? true : false}
                        selectThisSong={selectThisSong}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                songMenuToOpen && (
                    <div className="AllTracks-ContextMenu-container" 
                    onClick={() => {
                        setSongMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setSongMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={songMenuToOpen.title}
                            CMtype={contextMenuEnum.SongCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
        </motion.div>
    )
}

export default AllTracks