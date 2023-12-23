import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { ChevronDown, Shuffle } from "@assets/icons";
import { AddSongToPlaylistModal, DropDownMenuSmall, GeneralContextMenu, PropertiesModal, RectangleSongBox } from "@components/index";
import "@styles/pages/AllTracks.scss";
import { ViewportList } from 'react-viewport-list';
import { local_albums_db, local_songs_db } from "@database/database";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate } from "react-router-dom";

const AllTracks = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [sort, setSort] = useState<{aToz: string, by: string}>({aToz: "Ascending", by: "Alphabetically"});
    const [openedDDM, setOpenedDDM] = useState<string | null>(null);
    const SongList = useLiveQuery(() => local_songs_db.songs.toArray()) ?? [];
    const [songMenuToOpen, setSongMenuToOpen] = useState< Song | null>(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

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
        if(arg === contextMenuButtons.ShowInfo){ setIsPropertiesModalOpen(true);}
        else if(arg === contextMenuButtons.AddToPlaylist){ setIsPlaylistModalOpen(true); }
    }

    async function navigateTo(key: number, type: "artist" | "song"){
        const relatedSong = SongList.find((value) => value.id === key);
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
                <motion.div className="shuffle-btn" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}}>
                    <h4>shuffle & play</h4>
                    <Shuffle />
                </motion.div>
            </div>
            <div className="AllTracks_container" ref={ref}>
                <ViewportList viewportRef={ref} items={SongList}>
                    {(song, index) => (
                        <RectangleSongBox 
                        key={song.id}
                        keyV={song.id}
                        index={index + 1} 
                        cover={song.cover} 
                        songName={song.name} 
                        artist={song.artist}
                        length={song.duration} 
                        year={song.year}
                        selected={selected === index + 1 ? true : false}
                        navigateTo={navigateTo}
                        selectThisSong={selectThisSong}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                songMenuToOpen && (
                    <div className="AllTracks-ContextMenu-container" 
                    onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        if(e.target !== e.currentTarget)return;
                        setSongMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                        if(e.target !== e.currentTarget)return;
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
            <div className="bottom_margin"/>
            <PropertiesModal isOpen={isPropertiesModalOpen} song={songMenuToOpen!} closeModal={() => {setIsPropertiesModalOpen(false); setSongMenuToOpen(null);}} />
            <AddSongToPlaylistModal 
                isOpen={isPlaylistModalOpen} 
                songPath={songMenuToOpen ? songMenuToOpen.path : ""} 
                closeModal={() => {setIsPlaylistModalOpen(false); setSongMenuToOpen(null);}} />
        </motion.div>
    )
}

export default AllTracks