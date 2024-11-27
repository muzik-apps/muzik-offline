import { motion } from "framer-motion";
import { SkipBack, Pause, SkipFwd, Shuffle, VolumeMin, VolumeMax, Repeat, Play, RepeatOne } from "@icons/index";
import "@styles/components/music/MainMusicPlayer.scss";
import { usePlayerStore, usePlayingPosition, usePlayingPositionSec, useSavedObjectStore } from "store";
import { getCoverURL, getNullRandomCover, secondsToTimeFormat } from "utils";
import { changeVolumeLevel, changeSeekerPosition, dragSeeker, changeVolumeLevelBtnPress, repeatToggle, pauseSong, playSong, shuffleToggle, setVolumeLevel, playPreviousSong, playNextSong } from "utils/playerControl";
import { OSTYPEenum } from "@muziktypes/index";

const MainMusicPlayer = () => {
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {Player} = usePlayerStore((state) => { return { Player: state.Player}; });
    const {playingPosInSec, setplayingPosInSec} = usePlayingPositionSec((state) => { return {playingPosInSec: state.position, setplayingPosInSec: state.setPosition}; });
    const {playingPosition, setplayingPosition} = usePlayingPosition((state) => { return {playingPosition: state.position, setplayingPosition: state.setPosition}; });

    function changeVolume(event : any){changeVolumeLevel(event.target.value);}

    function changeSeeker(event : any){changeSeekerPosition(event.target.value);}

    function draggingSeeker(event: any){
        setplayingPosition(event.target.value); 
        dragSeeker().then(() => {
            setplayingPosInSec(Math.floor((event.target.value / 100) * Player.lengthOfSongInSeconds));
        });
    }

    function changeVolumeBtnPress(isDecreasing: boolean){changeVolumeLevelBtnPress(isDecreasing);}

    return (
        <div className="main_music_player">
            <div className="song_cover_art">
                    <div className="first_cover">
                        {local_store.OStype !== OSTYPEenum.Linux && !Player.playingSongMetadata && <img src={getCoverURL("NULL_COVER_NULL")} alt="song-art" loading="lazy"/>}
                        {/**no song is loaded onto the player */}
                        {local_store.OStype !== OSTYPEenum.Linux && Player.playingSongMetadata && Player.playingSongMetadata.cover_uuid && (<img src={getCoverURL(Player.playingSongMetadata.cover_uuid)} alt="song-art" />)}
                        {/**there is cover art */}
                        {local_store.OStype !== OSTYPEenum.Linux && Player.playingSongMetadata && !Player.playingSongMetadata.cover_uuid && <img src={getCoverURL(getNullRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))} alt="song-cover" />}
                        {/**the cover art is null */}
                    </div>
                <div className="second_cover">
                    {!Player.playingSongMetadata && <img src={getCoverURL("NULL_COVER_NULL")} alt="song-art" loading="lazy"/>}
                    {/**no song is loaded onto the player */}
                    {Player.playingSongMetadata && Player.playingSongMetadata.cover_uuid && (<img src={getCoverURL(Player.playingSongMetadata.cover_uuid)} alt="song-art" />)}
                    {/**there is cover art */}
                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover_uuid && <img src={getCoverURL(getNullRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))} alt="song-cover" />}
                    {/**the cover art is null */}
                </div>
            </div>
            <div className="song_details">
                <h2>{Player.playingSongMetadata ? Player.playingSongMetadata.name : "No song is playing"}</h2>
                <h3>{Player.playingSongMetadata ? Player.playingSongMetadata.artist : "No song is playing"}</h3>
            </div>
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
                <p>{Player.playingSongMetadata ? secondsToTimeFormat(Player.lengthOfSongInSeconds) : "~"}</p>
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
        </div>
    )
}

export default MainMusicPlayer