import {FunctionComponent, useEffect, useRef, useState} from "react";
import "@styles/components/music/AppMusicPlayer.scss";
import {ChromeCast, DotHorizontal, NullCoverNull, Pause, Play, Repeat, RepeatOne, Shuffle, SkipBack, SkipFwd, VolumeMax, VolumeMin} from "@icons/index"
import { motion } from "framer-motion";
import { usePlayerStore, usePlayingPosition, usePlayingPositionSec, useSavedObjectStore } from "store";
import { getRandomCover, secondsToTimeFormat } from "utils";
import { invoke } from "@tauri-apps/api";
import { changeVolumeLevel, changeSeekerPosition, changeVolumeLevelBtnPress, dragSeeker, pauseSong, playSong, repeatToggle, shuffleToggle, setVolumeLevel, reconfigurePlayer_AtEndOfSong, playPreviousSong, playNextSong } from "utils/playerControl";
import { AirplayCastModal } from "..";

type AppMusicPlayerProps = {
    openPlayer: () => void;
    toggleFloatingHNState: () => void;
}

const AppMusicPlayer : FunctionComponent<AppMusicPlayerProps> = (props: AppMusicPlayerProps) => {
    const [openAirplayCastModal, setOpenAirplayCastModal] = useState<boolean>(false);
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
            else if(ev.key === "ArrowRight"){//seek to 10 seconds ahead

            }
            else if(ev.key === "ArrowLeft"){//seek to 10 seconds behind

            }
        }
    }

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
        <>
            <div className={"app_music_player " + (local_store.PlayerBar ? "app_music_player_border" : "")}>
                <div className="music_cover_art">
                    {!local_store.PlayerBar && !Player.playingSongMetadata
                        && <NullCoverNull />}{/**no song is loaded onto the player */}
                    {!local_store.PlayerBar && Player.playingSongMetadata && Player.playingSongMetadata.cover
                        && (<img src={`data:image/png;base64,${Player.playingSongMetadata.cover}`} alt="cover-art" />)}{/**there is cover art */}
                    {!local_store.PlayerBar && Player.playingSongMetadata && !Player.playingSongMetadata.cover
                        && (getRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))()}{/**the cover art is null */}
                </div>
                <div className="music_art_bg_layer">
                    <div className="art_and_song_details">
                        <motion.div className="mini_art_container" whileTap={{scale: 0.98}} onClick={props.openPlayer}>
                                {!Player.playingSongMetadata && <NullCoverNull />}{/**no song is loaded onto the player */}
                                {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={`data:image/png;base64,${Player.playingSongMetadata.cover}`} alt="song-art" />)}{/**there is cover art */}
                                {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))()}{/**the cover art is null */}
                        </motion.div>
                        <div className="song_details">
                            <h2>{Player.playingSongMetadata ? Player.playingSongMetadata.name : "No song is playing"}</h2>
                            <h3>{Player.playingSongMetadata ? Player.playingSongMetadata.artist : "No song is playing"}</h3>
                        </div>
                    </div>
                    <div className="music_controller">
                        <div className="Controls">
                            <motion.div className={"control_icon" + (Player.repeatingLevel > 0 ? " coloured" : "")} 
                            whileTap={{scale: 0.98}} onClick={repeatToggle}>
                                {Player.repeatingLevel === 2 ?
                                    <RepeatOne />
                                    :
                                    <Repeat />
                                }
                            </motion.div>
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
                            <motion.div className={"control_icon" + (Player.isShuffling ? " coloured" : "")}  
                            whileTap={{scale: 0.98}} onClick={shuffleToggle}>
                                <Shuffle />
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
                    </div>
                    <div className="more_controls_cast_and_volume_controller">
                        <motion.div className="more_icon" whileTap={{scale: 0.98}} onClick={props.toggleFloatingHNState}>
                            <DotHorizontal />
                        </motion.div>
                        <motion.div className="cast_icon" whileTap={{scale: 0.98}} onClick={() => setOpenAirplayCastModal(true)}>
                            <ChromeCast />
                        </motion.div>
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
                    </div>
                </div>
            </div>
            <AirplayCastModal isOpen={openAirplayCastModal} closeModal={() => setOpenAirplayCastModal(false)}/>
        </>
    )
}

export default AppMusicPlayer