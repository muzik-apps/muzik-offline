import { useState } from "react";
import { artist1, largealbumpic, song8 } from "@assets/index";
import { GeneralContextMenu, RectangleSongBox } from "@components/index";
import "@styles/pages/SongAlbumDetails.scss";
import { motion } from "framer-motion";
import { Heart, HeartFull, Play } from "@assets/icons";
import { contextMenuEnum, mouse_coOrds } from "types";

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
    hearted: false
  },
  {
    key: 1,
    cover: song8,
    songName: "Sample Song 2",
    artist: "Artist 1",
    explicitStatus: true,
    length: "00:28",
    hearted: false
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
]

const album: {
    cover: string | null;
    title: string;
    artist: string;
    genre: string;
    year: string;
    hearted: boolean;
    song_count: number;
    length: number;
    copyright: string;
} = {
    cover: largealbumpic,
    title: "Album/Song/MT name goes here",
    artist: "Artist name goes here",
    genre: "Genre goes here",
    year: "2022",
    hearted: true,
    song_count: 4,
    length: 11,
    copyright: "c Lorem ipsum dolor sit amet massa suspendisse ac venenatis tincidunt vestibulum. Interdum pulvinar sodales mollis auctor metus."
}

const SongAlbumDetails = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
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

    function calculateListenTime(len: number){return "";}

    function changeSongAlbumHeartedState(arg: boolean){}

    function changeSongsHeartedState(arg: boolean){}

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = songs.find(song => { return song.key === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    return (
        <motion.div className="SongAlbumDetails"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <div className="cover_art">
                    <div className="first_cover">
                        <img src={album.cover!} alt="first-cover"/>
                    </div>
                    <div className="second_cover">
                        <img src={album.cover!} alt="second-cover"/>
                    </div>
                </div>
                <div className="details">
                    <h2>{album.title}</h2>
                    <div className="artist_details">
                        <div className="artist_profile">
                            <img src={artist1} alt=""/>
                        </div>
                        <h3>{album.artist}</h3>
                    </div>
                    <h4>{album.genre + " " + album.year}</h4>
                    <div className="action_buttons">
                        <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                            <Play />
                            <p>play</p>
                        </motion.div>
                        {   album.hearted ?
                            <motion.div className="HeartFullIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                <HeartFull />
                                <p>remove from library</p>
                            </motion.div>
                            :
                            <motion.div className="HeartIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Heart />
                                    <p>add to library</p>
                            </motion.div>
                        }
                    </div>
                </div>
            </div>
            <div className="main_content">
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
                <div className="footer_content">
                    <h4>{album.song_count} Songs, {calculateListenTime(album.length)} minutes listen time</h4>
                    <p>{album.copyright}</p>
                </div>
            </div>
            {
                songMenuToOpen && (
                    <div className="SongAlbumDetails-ContextMenu-container" 
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
        </motion.div>
    )
}

export default SongAlbumDetails