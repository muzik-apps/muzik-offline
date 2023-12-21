import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import "@styles/layouts/HistoryNextFloating.scss";
import { GeneralContextMenu, SongCardResizable } from "@components/index";
import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { local_albums_db } from "@database/database";
import { useNavigate } from "react-router-dom";

type HistoryNextFloatingProps = {
    FloatingHNState: boolean;
    toggleFloatingHNState: () => void;
}

const variants={
    open: {right: "16px"},
    closed: {right: "-300px"},
}

const HistoryNextFloating : FunctionComponent<HistoryNextFloatingProps> = (props: HistoryNextFloatingProps) => {
    const [selectedView, setSelectedView] = useState<string>("Upcoming_tab");
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [SongQueue,] = useState<Song[]>([]);
    const [SongHistory,] = useState<Song[]>([]);
    const [songMenuToOpen, setSongMenuToOpen] = useState< Song | null>(null);
    const navigate = useNavigate();

    function selectView(arg: string){setSelectedView(arg);}

    function setMenuOpenData__SongQueue(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongQueue.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function setMenuOpenData_SongHistory(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongHistory.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    async function navigateToSH(key: number, type: "artist" | "song"){
        const relatedSong = SongHistory.find((value) => value.id === key);
        if(!relatedSong)return;
        if(type === "song"){
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).toArray();
            navigate(`/AlbumDetails/${albumres[0].key}/undefined`);
        }
        else if(type === "artist"){
            navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        }
    }

    async function navigateToSQ(key: number, type: "artist" | "song"){
        const relatedSong = SongQueue.find((value) => value.id === key);
        if(!relatedSong)return;
        if(type === "song"){
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).toArray();
            navigate(`/AlbumDetails/${albumres[0].key}/undefined`);
        }
        else if(type === "artist"){
            navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        }
    }

    return (
        <>
            <motion.div className="HistoryNextFloating"
                animate={props.FloatingHNState ? "open" : "closed"}
                variants={variants}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
                { props.FloatingHNState &&
                    <>
                        {
                            selectedView === "Upcoming_tab" ?
                            <div className="Upcoming_view">
                                {
                                    SongQueue.slice(0, 20).map((song) => 
                                        <SongCardResizable 
                                            key={song.id}
                                            cover={song.cover} 
                                            songName={song.title}
                                            artist={song.artist}
                                            keyV={song.id}
                                            setMenuOpenData={setMenuOpenData__SongQueue}
                                            navigateTo={navigateToSQ}/>
                                    )
                                }
                            </div>
                            :
                            <div className="History_view">
                                {
                                    SongHistory.slice(SongHistory.length - 21, SongHistory.length - 1).map((song) => 
                                        <SongCardResizable 
                                            key={song.id}
                                            cover={song.cover} 
                                            songName={song.title}
                                            artist={song.artist}
                                            keyV={song.id}
                                            setMenuOpenData={setMenuOpenData_SongHistory}
                                            navigateTo={navigateToSH}/>
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
                    </>
                }
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
                            title={songMenuToOpen.name}
                            CMtype={contextMenuEnum.SongCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </>
    )
}

export default HistoryNextFloating