import { useEffect, useState } from "react";
import { NullCoverFour, NullCoverOne, NullCoverThree, NullCoverTwo, artist1 } from "@assets/index";
import { GeneralContextMenu, RectangleSongBox } from "@components/index";
import "@styles/pages/AlbumDetails.scss";
import { motion } from "framer-motion";
import { Play, Shuffle } from "@assets/icons";
import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { useParams } from "react-router-dom";
import { local_albums_db } from "@database/database";
import { getAlbumSongs, secondsToTimeFormat } from "utils";

interface AlbumMD {cover: string | null;title: string;artist: string;year: string;song_count: number;length: string;}

const emptyMD: AlbumMD = {cover: null,title: "",artist: "",year: "",song_count: 0,length: ""}

const AlbumDetails = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [SongList, setSongList] = useState<Song[]>([]);
    const [album_metadata, setAlbumMetadata] = useState<AlbumMD>(emptyMD);
    const [songMenuToOpen, setSongMenuToOpen] = useState<Song | null>(null);
    const { key } = useParams(); 

    function selectThisSong(index: number){ setSelected(index); }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongList.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    function getRandomCover(): () => JSX.Element{
        if(key === undefined)return NullCoverOne;
        const modv: number = Number.parseInt(key) % 4;
        if(modv === 0)return NullCoverOne;
        else if(modv === 1)return NullCoverTwo;
        else if(modv === 2)return NullCoverThree;
        else return NullCoverFour;
    }

    useEffect(() => {
        const setAlbumSongs = () => {
            if(key === undefined)return;
            local_albums_db.albums.where("key").equals(Number.parseInt(key)).toArray().then(async(res) => {
                const result = await getAlbumSongs(res[0]);
                setAlbumMetadata({
                    cover: res[0].cover,
                    title: res[0].title,
                    artist: result.songs[0].artist,
                    year: result.songs[0].year.toString(),
                    song_count: result.songs.length,
                    length: secondsToTimeFormat(result.totalDuration)
                });
                setSongList(result.songs);
            }).catch((_err) => {});
        }

        setAlbumSongs();
    }, [])
    

    return (
        <motion.div className="AlbumDetails"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <div className="cover_art">
                    <div className="first_cover">
                        {
                            album_metadata.cover ?
                                <img src={`data:image/png;base64,${album_metadata.cover}`} alt="first-cover"/>
                            :
                            getRandomCover()()
                        }
                    </div>
                    <div className="second_cover">
                        {
                            album_metadata.cover ?
                                <img src={`data:image/png;base64,${album_metadata.cover}`} alt="second-cover"/>
                            :
                            getRandomCover()()
                        }
                    </div>
                </div>
                <div className="details">
                    <h2>{album_metadata.title}</h2>
                    <div className="artist_details">
                        <div className="artist_profile">
                            {
                                album_metadata.cover ?
                                    <img src={`data:image/png;base64,${album_metadata.cover}`} alt="second-cover"/>
                                :
                                getRandomCover()()
                            }
                        </div>
                        <h3>{album_metadata.artist}</h3>
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
                </div>
            </div>
            <div className="main_content">
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
                            setMenuOpenData={setMenuOpenData}/>
                    )
                }
                <div className="footer_content">
                    <h4>{album_metadata.song_count} {album_metadata.song_count > 1 ? "Songs" : "Song"}, {album_metadata.length} listen time</h4>
                </div>
            </div>
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