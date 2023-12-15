import { motion } from "framer-motion";
import { NullCoverFour, NullCoverOne, NullCoverThree, NullCoverTwo } from "@assets/index";
import { SkipBack, Pause, SkipFwd, Shuffle, VolumeMin, VolumeMax, Repeat, Play, RepeatOne, NullCoverNull } from "@icons/index";
import "@styles/components/music/MainMusicPlayer.scss";
import useLocalStorageState from "use-local-storage-state";
import { SavedObject, emptySavedObject } from "@database/index";
import { emptyPlayer, Player } from "types";

const MainMusicPlayer = () => {
    const [local_store, setStore] = useLocalStorageState<SavedObject>("SavedObject-offline", {defaultValue: emptySavedObject});
    const [Player, setPlayer] = useLocalStorageState<Player>("Player-offline", {defaultValue: emptyPlayer});

    function changeVolume(event : any){
        setStore({ ... local_store, Volume : event.target.value});
        //do backend rust stuff
    }

    function changeSeeker(event : any){
        if(Player.playingSongMetadata === null){
            setPlayer({ ... Player, playingPosition : 0});
        }
        else {
            setPlayer({ ... Player, playingPosition : event.target.value});
        }
        //do backend rust stuff
    }

    function playSong(){if(Player.playingSongMetadata)setPlayer({ ... Player, isPlaying : true});}

    function pauseSong(){setPlayer({ ... Player, isPlaying : false});}

    function shuffleToggle(){setPlayer({ ... Player, isShuffling : !Player.isShuffling});}

    function repeatToggle(){setPlayer({ ... Player, repeatingLevel : Player.repeatingLevel + 1 > 2 ? 0 : (Player.repeatingLevel + 1) as 0 | 1 | 2});}
    
    function changeVolumeBtnPress(isDecreasing: boolean){
        if(isDecreasing === true){
            const level: number = (local_store.Volume - parseInt(local_store.VolumeStepAmount));
            setStore({ ... local_store, Volume : level <= 0 ? 0 : level});
        }
        else{
            const level: number = (local_store.Volume + parseInt(local_store.VolumeStepAmount));
            setStore({ ... local_store, Volume : level >= 100 ? 100 : level});
        }
    }

    function getRandomCover(): () => JSX.Element{
        const id = Player.playingSongMetadata?.id;
        const modv: number = id ? id % 4 : 0;
        if(modv === 0)return NullCoverOne;
        else if(modv === 1)return NullCoverTwo;
        else if(modv === 2)return NullCoverThree;
        else return NullCoverFour;
    }

    function getSeekerPercentage(){
        return Player.playingPosition.toString();
    }

    return (
        <div className="main_music_player">
            <div className="song_cover_art">
                <div className="first_cover">
                    {!Player.playingSongMetadata && <NullCoverNull />}{/**no song is loaded onto the player */}
                    {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={""} alt="song-art" />)}{/**there is cover art */}
                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover())()}{/**the cover art is null */}
                </div>
                <div className="second_cover">
                    {!Player.playingSongMetadata && <NullCoverNull />}{/**no song is loaded onto the player */}
                    {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={""} alt="song-art" />)}{/**there is cover art */}
                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover())()}{/**the cover art is null */}
                </div>
            </div>
            <div className="song_details">
                <h2>{Player.playingSongMetadata ? Player.playingSongMetadata.title : "No song is playing"}</h2>
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
    )
}

export default MainMusicPlayer