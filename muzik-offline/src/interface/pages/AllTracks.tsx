import { song8 } from "@assets/index";
import { contextMenuEnum, mouse_coOrds } from "types";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "@assets/icons";
import { DropDownMenuSmall, GeneralContextMenu, RectangleSongBox } from "@components/index";
import "@styles/pages/AllTracks.scss";

const songs: {
    key: number;
    cover: string;
    songName: string;
    artist: string;
    explicitStatus: boolean;
    length: number | string;
    hearted: boolean;
}[] = [
    {
        key: 0,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 1,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 2,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 3,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 4,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 5,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 6,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 7,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 8,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 9,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 10,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 11,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 12,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 13,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 14,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 15,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 16,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 17,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 18,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 19,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 20,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 21,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 22,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 23,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 24,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 25,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "00:28",
        hearted: true
    },
    {
        key: 26,
        cover: song8,
        songName: "Sample Song 3 feat Sample Artist 1 & Sample Artist 2",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
    {
        key: 27,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Artist 1",
        explicitStatus: true,
        length: "01:28",
        hearted: true
    },
]

const AllTracks = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [sort, setSort] = useState<{aToz: string, by: string}>({aToz: "Ascending", by: "Alphabetically"});
    const [openedDDM, setOpenedDDM] = useState<string | null>(null);
    const [songMenuToOpen, setSongMenuToOpen] = useState<{
        key: number;
        cover: string;
        songName: string;
        artist: string;
        explicitStatus: boolean;
        length: number | string;
        hearted: boolean;
    } | null>(null);

    function selectThisSong(index: number){ setSelected(index); }

    function changeSongsHeartedState(arg: boolean){}

    function selectOption(arg: string){
        if(openedDDM === "aToz" && arg !== sort.aToz)setSort({...sort, aToz: arg}); 
        if(openedDDM === "by" && arg !== sort.by)setSort({...sort, by: arg}); 
        setOpenedDDM(null);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = songs.find(song => { return song.key === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
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
            <div className="AllTracks_container">
                {
                    songs.map((song, index) =>
                        <RectangleSongBox 
                            key={song.key}
                            keyV={song.key}
                            index={index + 1} 
                            cover={song.cover} 
                            songName={song.songName} 
                            artist={song.artist} 
                            explicitStatus={song.explicitStatus} 
                            length={song.length} 
                            hearted={song.hearted} 
                            selected={selected === index + 1 ? true : false}
                            selectThisSong={selectThisSong}
                            setMenuOpenData={setMenuOpenData}/>
                    )
                }
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
                            title={songMenuToOpen.songName} 
                            hearted={songMenuToOpen.hearted}
                            CMtype={contextMenuEnum.SongCM}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
        </motion.div>
    )
}

export default AllTracks