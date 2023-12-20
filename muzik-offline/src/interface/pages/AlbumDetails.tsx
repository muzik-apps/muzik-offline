import { useEffect, useRef, useState } from "react";
import { GeneralContextMenu, LargeResizableCover, RectangleSongBox } from "@components/index";
import "@styles/pages/AlbumDetails.scss";
import { motion } from "framer-motion";
import { Play, Shuffle } from "@assets/icons";
import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { local_albums_db } from "@database/database";
import { getAlbumSongs, getRandomCover, secondsToTimeFormat } from "utils";

interface AlbumMD {cover: string | null;title: string;artist: string;year: string;song_count: number;length: string;}

const emptyMD: AlbumMD = {cover: null,title: "",artist: "",year: "",song_count: 0,length: ""}

const variants_list = {smaller: { height: "calc(100vh - 395px)" },bigger: { height: "calc(100vh - 195px)" }}

const AlbumDetails = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [SongList, setSongList] = useState<Song[]>([]);
    const [album_metadata, setAlbumMetadata] = useState<AlbumMD>(emptyMD);
    const [songMenuToOpen, setSongMenuToOpen] = useState<Song | null>(null);
    const navigate = useNavigate();
    
    const [resizeHeader, setResizeHeader] = useState<boolean>(false);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const { album_key, artist_name } = useParams(); 

    function selectThisSong(index: number){ setSelected(index); }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongList.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    function handleScroll(){
        const scrollY = itemsHeightRef.current?.scrollTop ?? 0;
        // NOTE: The following console.log might affect the timing of the code execution.
        // If you experience issues with state updates, it's recommended to investigate
        // potential asynchronous behavior and consider removing or adjusting this log.
        console.log;
        if(scrollY === 0)setResizeHeader(false);
        else if(resizeHeader === false)setResizeHeader(true);
    };

    async function setAlbumSongs(){
        if(album_key === undefined)return;
        const albumres = await local_albums_db.albums.where("key").equals(Number.parseInt(album_key)).toArray();
        if(albumres.length !== 1)return;
        const result = await getAlbumSongs(albumres[0], artist_name && artist_name !== "undefined" ? artist_name : "");
        setAlbumMetadata({
            cover: result.cover, title: albumres[0].title, artist: result.songs[0].artist,
            year: result.songs[0].year.toString(),song_count: result.songs.length,
            length: secondsToTimeFormat(result.totalDuration)
        });
        setSongList(result.songs);
    }

    useEffect(() => {
        setAlbumSongs();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])
    

    return (
        <motion.div className="AlbumDetails"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={album_key} resizeHeader={resizeHeader} cover={album_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: resizeHeader ? "25px" : "68px" }}>{album_metadata.title}</h2>
                    { !resizeHeader &&
                        <>
                            <div className="artist_details">
                                <div className="artist_profile">
                                    {
                                        album_metadata.cover ?
                                            <img src={`data:image/png;base64,${album_metadata.cover}`} alt="second-cover"/>
                                        :
                                        getRandomCover(album_key ? Number.parseInt(album_key) : 2)()
                                    }
                                </div>
                                <motion.h3 whileTap={{scale: 0.98}} onClick={() => navigate(`/ArtistCatalogue/${album_metadata.artist}`)}>{album_metadata.artist}</motion.h3>
                            </div>
                            <h4>{album_metadata.year}</h4>
                            <div className="action_buttons">
                                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Play />
                                    <p>play</p>
                                </motion.div>
                                <motion.div className="ShuffleIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Shuffle />
                                    <p>Shuffle</p>
                                </motion.div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <motion.div className="main_content" 
                animate={resizeHeader ? "bigger" : "smaller"}
                variants={variants_list}
                transition={{ type: "tween" }}
                ref={itemsHeightRef}>
                {
                    SongList.map((song, index) =>
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
                            setMenuOpenData={setMenuOpenData} 
                            navigateTo={(_key: number, _type: "artist" | "song") => {} }/>
                    )
                }
                <div className="footer_content">
                    <h4>{album_metadata.song_count} {album_metadata.song_count > 1 ? "Songs" : "Song"}, {album_metadata.length} listen time</h4>
                </div>
            </motion.div>
            {
                songMenuToOpen && (
                    <div className="AlbumDetails-ContextMenu-container" 
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
        </motion.div>
    )
}

export default AlbumDetails