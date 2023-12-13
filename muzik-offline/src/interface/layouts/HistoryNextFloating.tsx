import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import "@styles/layouts/HistoryNextFloating.scss";
import { GeneralContextMenu, SongCardResizable } from "@components/index";
import { song8 } from "@assets/index";
import { contextMenuEnum, mouse_coOrds, songDetails } from "types";

type HistoryNextFloatingProps = {
    FloatingHNState: boolean;
    toggleFloatingHNState: () => void;
}

const variants={
    open: {right: "16px"},
    closed: {right: "-300px"},
}

const song_queue: songDetails[] = [
    {
        key: 1,
        cover: song8,
        songName: "Sample Song 1",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 2,
        cover: song8,
        songName: "Sample Song 2",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 3,
        cover: song8,
        songName: "Sample Song 3",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 4,
        cover: song8,
        songName: "Sample Song 4",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 5,
        cover: song8,
        songName: "Sample Song 5",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 6,
        cover: song8,
        songName: "Sample Song 6",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 7,
        cover: song8,
        songName: "Sample Song 8",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 8,
        cover: song8,
        songName: "Sample Song 9",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 9,
        cover: song8,
        songName: "Sample Song 10",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 10,
        cover: song8,
        songName: "Sample Song 11",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 11,
        cover: song8,
        songName: "Sample Song 11",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 12,
        cover: song8,
        songName: "Sample Song 12",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    },
    {
        key: 13,
        cover: song8,
        songName: "Sample Song 13",
        artist: "Sample artist 5",
        explicitStatus: true,
        hearted: true
    }
]

const HistoryNextFloating : FunctionComponent<HistoryNextFloatingProps> = (props: HistoryNextFloatingProps) => {
    const [selectedView, setSelectedView] = useState<string>("Upcoming_tab");
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [songMenuToOpen, setSongMenuToOpen] = useState<songDetails | null>(null);

    function selectView(arg: string){setSelectedView(arg);}

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = song_queue.find(song => { return song.key === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    return (
        <>
            <motion.div className="HistoryNextFloating"
                animate={props.FloatingHNState ? "open" : "closed"}
                variants={variants}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                {
                    selectedView === "Upcoming_tab" ?
                    <div className="Upcoming_view">
                        {
                            song_queue.map((song) => 
                                <SongCardResizable 
                                    key={song.key}
                                    cover={song.cover} 
                                    songName={song.songName}
                                    artist={song.artist}
                                    explicitStatus={song.explicitStatus}
                                    keyV={song.key}
                                    setMenuOpenData={setMenuOpenData}
                                    />
                            )
                        }
                    </div>
                    :
                    <div className="History_view">
                        {
                            song_queue.map((song) => 
                                <SongCardResizable 
                                    key={song.key}
                                    cover={song.cover} 
                                    songName={song.songName}
                                    artist={song.artist}
                                    explicitStatus={song.explicitStatus}
                                    keyV={song.key}
                                    setMenuOpenData={setMenuOpenData}
                                    />
                            )
                        }
                    </div>
                }
                <div className="HistoryUpcoming_tabs">
                    <motion.div className="Upcoming_tab" onMouseUp={() => selectView("Upcoming_tab")} whileTap={{scale: 0.98}}>
                    {selectedView === "Upcoming_tab" && <motion.div layoutId="active-pill" className="selected"/>}
                    <h3>Upcoming</h3>
                    </motion.div>
                    <motion.div className="History_tab" onMouseUp={() => selectView("History_tab")} whileTap={{scale: 0.98}}>
                    {selectedView === "History_tab" && <motion.div layoutId="active-pill" className="selected"/>}
                    <h3>History</h3>
                    </motion.div>
                </div>
            </motion.div>

            {
                songMenuToOpen && (
                    <div className="HistoryNextFloating-ContextMenu-container" 
                    onMouseUp={() => {
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
                            CMtype={contextMenuEnum.SongCM}/>
                    </div>
                )
            }
        </>
    )
}

export default HistoryNextFloating