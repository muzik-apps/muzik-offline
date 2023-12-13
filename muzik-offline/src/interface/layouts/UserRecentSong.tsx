import { RectangleSongBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, Song } from "types";
import { useState } from "react";
import "@styles/layouts/UserRecentSong.scss";
import useLocalStorageState from "use-local-storage-state";

const UserRecentSong = () => {
    const [selected, setSelectedSong] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [SongList,] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});
    const [songMenuToOpen, setSongMenuToOpen] = useState< Song | null>(null);

    function selectThisSong(index: number){ setSelectedSong(index); }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongList.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    return (
        <div className="UserRecentSong">
            <div className="UserRecentSong-container">
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
                            title={songMenuToOpen.title}
                            CMtype={contextMenuEnum.SongCM}/>
                    </div>
                )
            }
        </div>
    )
}

export default UserRecentSong