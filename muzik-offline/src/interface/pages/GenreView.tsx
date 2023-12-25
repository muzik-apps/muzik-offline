import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGenreSongs, secondsToTimeFormat } from "utils";
import { motion } from "framer-motion";
import { GeneralContextMenu, LargeResizableCover, RectangleSongBox } from "@components/index";
import { Play, Shuffle } from "@assets/icons";
import { local_albums_db, local_genres_db } from "@database/database";
import "@styles/pages/GenreView.scss";
import { ViewportList } from "react-viewport-list";

interface GenreMD {cover: string | null;genreName: string;song_count: number;length: string;}

const emptyMD: GenreMD = {cover: null,genreName: "",song_count: 0,length: ""}

const variants_list = {smaller: { height: "calc(100vh - 395px)" },bigger: { height: "calc(100vh - 195px)" }}

const GenreView = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [SongList, setSongList] = useState<Song[]>([]);
    const [genre_metadata, setGenreMetadata] = useState<GenreMD>(emptyMD);
    const [songMenuToOpen, setSongMenuToOpen] = useState<Song | null>(null);
    const navigate = useNavigate();
    
    const [resizeHeader, setResizeHeader] = useState<boolean>(false);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const { genre_key } = useParams(); 

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
        if(genre_key === undefined)return;
        const genreres = await local_genres_db.genres.where("key").equals(Number.parseInt(genre_key)).toArray();
        if(genreres.length !== 1)return;
        const result = await getGenreSongs(genreres[0]);
        setGenreMetadata({
            cover: result.cover, genreName: genreres[0].title,
            song_count: result.songs.length,
            length: secondsToTimeFormat(result.totalDuration)
        });
        setSongList(result.songs);
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

    useEffect(() => {
        setAlbumSongs();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <motion.div className="GenreView"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={genre_key} resizeHeader={resizeHeader} cover={genre_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: resizeHeader ? "25px" : "68px" }}>{genre_metadata.genreName}</h2>
                    { !resizeHeader &&
                        <>
                            <h4>{genre_metadata.song_count} songs</h4>
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
                <ViewportList viewportRef={itemsHeightRef} items={SongList}>
                    {
                        (song, index) => (
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
                                navigateTo={navigateTo}
                                playThisSong={(_key: number,) => {}}/>
                        )
                    }
                </ViewportList>
                <div className="footer_content">
                    <h4>{genre_metadata.song_count} {genre_metadata.song_count > 1 ? "Songs" : "Song"}, {genre_metadata.length} listen time</h4>
                </div>
            </motion.div>
            {
                songMenuToOpen && (
                    <div className="GenreView-ContextMenu-container" 
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
                            title={songMenuToOpen.name}
                            CMtype={contextMenuEnum.SongCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </motion.div>
    )
}

export default GenreView