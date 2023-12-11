import { song8 } from "@assets/index";
import { RectangleSongBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum } from "types";
import { useState } from "react";
import "@styles/layouts/UserRecentSong.scss";

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

const UserRecentSong = () => {
    const [selectedSong, setSelectedSong] = useState<number>(0);
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

    function selectThisSong(index: number){ setSelectedSong(index); }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = songs.find(song => { return song.key === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    return (
        <div className="UserRecentSong">
            <div className="UserRecentSong-container">
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
                            selected={selectedSong === index + 1 ? true : false}
                            selectThisSong={selectThisSong}
                            setMenuOpenData={setMenuOpenData}/>
                    )
                }
            </div>
            {
                songMenuToOpen && (
                    <div className="UserRecentSong-ContextMenu-container" 
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
        </div>
    )
}

export default UserRecentSong