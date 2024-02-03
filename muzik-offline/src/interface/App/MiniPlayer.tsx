import { NullCoverNull, Pause, Play, SkipBack, SkipFwd, VolumeMax, VolumeMin } from "@assets/icons";
import { usePlayerStore, useSavedObjectStore, usePlayingPositionSec, usePlayingPosition } from "@store/index";
import { invoke } from "@tauri-apps/api";
import { getRandomCover, secondsToTimeFormat } from "@utils/index";
import { changeVolumeLevel, changeSeekerPosition, changeVolumeLevelBtnPress, dragSeeker, reconfigurePlayer_AtEndOfSong, pauseSong, playSong, changeSeekerPositionBtnPress, playNextSong, playPreviousSong, setVolumeLevel } from "@utils/playerControl";
import { motion } from "framer-motion";
import { FunctionComponent, useRef, useEffect, useState } from "react";
import "@styles/App/MiniPlayer.scss";

type MiniPlayerProps = {
    isOpen: boolean;
    closeMiniPlayer: () => void;
}

const MiniPlayer: FunctionComponent<MiniPlayerProps> = (props: MiniPlayerProps) => {
    const [isPinned, setPinned] = useState<boolean>(false);
    const {Player} = usePlayerStore((state) => { return { Player: state.Player}; });
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {playingPosInSec, setplayingPosInSec} = usePlayingPositionSec((state) => { return {playingPosInSec: state.position, setplayingPosInSec: state.setPosition}; });
    const {playingPosition, setplayingPosition} = usePlayingPosition((state) => { return {playingPosition: state.position, setplayingPosition: state.setPosition}; });
    const intervalIdRef = useRef<number>();

    function changeVolume(event : any){changeVolumeLevel(event.target.value);}

    function changeSeeker(event : any){changeSeekerPosition(event.target.value);}

    function changeVolumeBtnPress(isDecreasing: boolean){changeVolumeLevelBtnPress(isDecreasing);}

    function draggingSeeker(event: any){
        setplayingPosition(event.target.value); 
        dragSeeker().then(() => { 
            setplayingPosInSec(Math.floor((event.target.value / 100) * Player.lengthOfSongInSeconds)); 
        });
    }

    async function upDateSeeker(){
        const value: any = await invoke("get_song_position");
        if(value === Player.lengthOfSongInSeconds && Player.playingSongMetadata){
            reconfigurePlayer_AtEndOfSong();
        }
        else{
            setplayingPosInSec(Math.floor(value));
            setplayingPosition(Math.floor((value / Player.lengthOfSongInSeconds) * 100));
        }
    }

    function detectKeyPress(this: Window, ev: any){
        if(ev.target.id !== "gsearch"){
            if(ev.key === " "){//pause/play song
                if(Player.isPlaying)pauseSong();
                else playSong();
            }
            else if(ev.key === "ArrowRight")changeSeekerPositionBtnPress(false);
            else if(ev.key === "ArrowLeft")changeSeekerPositionBtnPress(true);
        }
    }

    async function toggleWindowPinState(){
        await invoke("toggle_app_pin", {pinApp: !isPinned});
        setPinned(!isPinned);
    }

    async function dragWindow(){ await invoke("drag_app_window"); }

    useEffect(() => {
        window.addEventListener("keydown", detectKeyPress);
        return () => {  window.removeEventListener("keydown", detectKeyPress); }
    }, [])

    useEffect(() => {
        if(Player.isPlaying)intervalIdRef.current = setInterval(upDateSeeker, 1000);
        else clearInterval(intervalIdRef.current);
        return () => clearInterval(intervalIdRef.current);// Cleanup function to clear the timer when the component unmounts or when the flag changes
    }, [Player.isPlaying]);

    return (
        <div className={"MiniPlayer " + (props.isOpen ? " MiniPlayer-visible" : "")}>
            <div className="image-container">
                <div className="music_cover_art">
                    {!Player.playingSongMetadata && <NullCoverNull />}{/**no song is loaded onto the player */}
                    {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={`data:image/png;base64,${Player.playingSongMetadata.cover}`} alt="cover-art" />)}{/**there is cover art */}
                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))()}{/**the cover art is null */}
                </div>
            </div>
            <div data-tauri-drag-region className="player">
                <div className="art_container" onMouseDown={dragWindow}>
                    {!Player.playingSongMetadata && <NullCoverNull/>}{/**no song is loaded onto the player */}
                    {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={`data:image/png;base64,${Player.playingSongMetadata.cover}`} alt="song-art" />)}{/**there is cover art */}
                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))()}{/**the cover art is null */}
                </div>
                <div className="song_details">
                    <h2>{Player.playingSongMetadata ? Player.playingSongMetadata.name : "No song is playing"}</h2>
                    <h3>{Player.playingSongMetadata ? Player.playingSongMetadata.artist : "No song is playing"}</h3>
                </div>
                <div className="Controls">
                    <motion.div className="control_icon" whileTap={{scale: 0.98}} onClick={playPreviousSong}>
                        <SkipBack />
                    </motion.div>
                    {Player.isPlaying ?
                        <motion.div className="control_icon" whileTap={{scale: 0.98}} onClick={pauseSong}>
                            <Pause />
                        </motion.div>
                        :
                        <motion.div className="control_icon" whileTap={{scale: 0.98}} onClick={playSong}>
                            <Play />
                        </motion.div>
                    }
                    <motion.div className="control_icon" whileTap={{scale: 0.98}} onClick={playNextSong}>
                        <SkipFwd />
                    </motion.div>
                </div>
                <div className="Seeker">
                    <p>{Player.playingSongMetadata ? secondsToTimeFormat(playingPosInSec) : "~"}</p>
                    <input type="range" id="seek-slider" max="100" 
                        value={playingPosition} 
                        onChange={draggingSeeker} 
                        onMouseUp={changeSeeker}
                        style={{backgroundSize: playingPosition.toString() + "% 100%"}}/>
                    <p>
                        {Player.playingSongMetadata ? 
                            secondsToTimeFormat(
                                local_store.SongLengthORremaining === "song length" ?
                                    Player.lengthOfSongInSeconds : Player.lengthOfSongInSeconds - playingPosInSec
                            ) 
                            : 
                            "~"}
                    </p>
                </div>
                <div className="volume_controller">
                    <motion.div className="volume_icon" whileTap={{scale: 0.98}} onClick={() => changeVolumeBtnPress(true)}>
                        <VolumeMin />
                    </motion.div>
                    <input type="range" id="volume-slider" max="100" 
                        value={local_store.Volume} 
                        onChange={changeVolume} 
                        onMouseUp={() => setVolumeLevel(local_store.Volume)}
                        style={{backgroundSize: local_store.Volume.toString() + "% 100%"}}/>
                    <motion.div className="volume_icon" whileTap={{scale: 0.98}} onClick={() => changeVolumeBtnPress(false)}>
                        <VolumeMax />
                    </motion.div>
                </div>
                <div className="player_control_buttons">
                    <motion.div className="button-left" whileTap={{scale: 0.98}} onClick={() => props.closeMiniPlayer()}>
                        <h3>player</h3>
                    </motion.div>
                    <motion.div className="button-right" whileTap={{scale: 0.98}} onClick={toggleWindowPinState}>
                        <h3>{isPinned ? "unpin" : "pin"}</h3>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default MiniPlayer