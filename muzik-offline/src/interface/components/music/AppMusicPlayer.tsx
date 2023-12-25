import {FunctionComponent, useEffect} from "react";
import "@styles/components/music/AppMusicPlayer.scss";
import {ChromeCast, DotHorizontal, NullCoverNull, Pause, Play, Repeat, RepeatOne, Shuffle, SkipBack, SkipFwd, VolumeMax, VolumeMin} from "@icons/index"
import { motion } from "framer-motion";
import { useSavedObjectStore, usePlayerStore } from "store";
import { SavedObject } from "@database/index";
import { invoke } from "@tauri-apps/api";
import { getRandomCover } from "utils";

type AppMusicPlayerProps = {
    openPlayer: () => void;
    toggleFloatingHNState: () => void;
}

const AppMusicPlayer : FunctionComponent<AppMusicPlayerProps> = (props: AppMusicPlayerProps) => {
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {Player, setPlayer} = usePlayerStore((state) => { return { Player: state.Player, setPlayer: state.setPlayer}; });

    function changeVolume(event : any){
        let temp: SavedObject = local_store;
        temp.Volume = event.target.value;
        setStore(temp);
        //do backend rust stuff
    }

    function changeSeeker(event : any){
        if(Player.playingSongMetadata === null){
            let temp = Player;
            temp.playingPosition = 0;
            setPlayer(temp);
        }
        else {
            let temp = Player;
            temp.playingPosition = event.target.value;
            setPlayer(temp);
            //do backend rust stuff
        }
    }

    async function playSong(){
        if(Player.playingSongMetadata){
            await invoke("resume_playing");
            let temp = Player;
            temp.isPlaying = true;
            setPlayer(temp);
        }
    }

    async function pauseSong(){
        await invoke("pause_song");
        let temp = Player;
        temp.isPlaying = false;
        setPlayer(temp);
    }

    function shuffleToggle(){
        let temp = Player;
        temp.isShuffling = !Player.isShuffling;
        setPlayer(temp);
    }

    function repeatToggle(){
        let temp = Player;
        temp.repeatingLevel = Player.repeatingLevel + 1 > 2 ? 0 : (Player.repeatingLevel + 1) as 0 | 1 | 2;
        setPlayer(temp);
    }

    function changeVolumeBtnPress(isDecreasing: boolean){
        if(isDecreasing === true){
            const level: number = (local_store.Volume - parseInt(local_store.VolumeStepAmount));
            let temp: SavedObject = local_store;
            temp.Volume = level <= 0 ? 0 : level;
            setStore(temp);
        }
        else{
            const level: number = (local_store.Volume + parseInt(local_store.VolumeStepAmount));
            let temp: SavedObject = local_store;
            temp.Volume = level >= 100 ? 100 : level;
            setStore(temp);
        }
    }

    function getSeekerPercentage(){
        return Player.playingPosition.toString();
    }

    function detectKeyPress(this: Window, ev: any){
        if(ev.target.id !== "gsearch"){
            if(ev.key === " "){//pause/play song
                if(Player.isPlaying)pauseSong();
                else playSong();
            }
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", detectKeyPress);
        return () => {  window.removeEventListener("keydown", detectKeyPress); }
    }, [])

    return (
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
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
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
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
                            <SkipFwd />
                        </motion.div>
                        <motion.div className={"control_icon" + (Player.isShuffling ? " coloured" : "")}  
                        whileTap={{scale: 0.98}} onClick={shuffleToggle}>
                            <Shuffle />
                        </motion.div>
                    </div>
                    <div className="Seeker">
                        <p>{Player.playingSongMetadata ? Player.playingPosition : "~"}</p>
                        <input type="range" id="seek-slider" max="100" value={Player.playingPosition} onChange={changeSeeker} style={{backgroundSize: getSeekerPercentage() + "% 100%"}}/>
                        <p>{Player.playingSongMetadata ? Player.playingSongMetadata.duration : "~"}</p>
                    </div>
                </div>
                <div className="more_controls_cast_and_volume_controller">
                    <motion.div className="more_icon" whileTap={{scale: 0.98}} onClick={props.toggleFloatingHNState}>
                        <DotHorizontal />
                    </motion.div>
                    <motion.div className="cast_icon" whileTap={{scale: 0.98}}>
                        <ChromeCast />
                    </motion.div>
                    <div className="volume_controller">
                        <motion.div className="volume_icon" whileTap={{scale: 0.98}} onClick={() => changeVolumeBtnPress(true)}>
                            <VolumeMin />
                        </motion.div>
                        <input type="range" id="volume-slider" value={local_store.Volume} max="100" onChange={changeVolume} style={{backgroundSize: local_store.Volume.toString() + "% 100%"}}/>
                        <motion.div className="volume_icon" whileTap={{scale: 0.98}} onClick={() => changeVolumeBtnPress(false)}>
                            <VolumeMax />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppMusicPlayer