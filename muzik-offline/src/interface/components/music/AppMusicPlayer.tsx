import {FunctionComponent} from "react";
import "@styles/components/music/AppMusicPlayer.scss";
import { artist, song_art } from "@assets/index";
import {ChromeCast, DotHorizontal, Pause, Repeat, Shuffle, SkipBack, SkipFwd, VolumeMax, VolumeMin} from "@icons/index"
import { motion } from "framer-motion";
import useLocalStorageState from "use-local-storage-state";
import { SavedObject, emptySavedObject } from "@database/index";

type AppMusicPlayerProps = {
    openPlayer: () => void;
    toggleFloatingLHNState: () => void;
}

const AppMusicPlayer : FunctionComponent<AppMusicPlayerProps> = (props: AppMusicPlayerProps) => {
    const [local_store, setStore] = useLocalStorageState<SavedObject>("SavedObject-offline", {defaultValue: emptySavedObject});

    function changeVolume(event : any){
        setStore({ ... local_store, Volume : event.target.value});
        //do backend rust stuff
    }

    function changeSeeker(event : any){
        setStore({ ... local_store, SongSeeker : event.target.value});
        //do backend rust stuff
    }

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

    return (
        <div className={"app_music_player " + (local_store.PlayerBar ? "app_music_player_border" : "")}>
            <div className="music_cover_art">
                {!local_store.PlayerBar && (<img src={artist} alt="cover-art" />)}
            </div>
            <div className="music_art_bg_layer">
                <div className="art_and_song_details">
                    <motion.div className="mini_art_container" whileTap={{scale: 0.98}} onClick={props.openPlayer}>
                        <img src={song_art} alt="song-art" />
                    </motion.div>
                    <div className="song_details">
                        <h2>Sample Song feat Sample Artist 3, Sample Artist 4</h2>
                        <h3>Sample Artist 1 & Sample Artist 2</h3>
                    </div>
                </div>
                <div className="music_controller">
                    <div className="Controls">
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
                            <Repeat />
                        </motion.div>
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
                            <SkipBack />
                        </motion.div>
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
                            <Pause />
                        </motion.div>
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
                            <SkipFwd />
                        </motion.div>
                        <motion.div className="control_icon" whileTap={{scale: 0.98}}>
                            <Shuffle />
                        </motion.div>
                    </div>
                    <div className="Seeker">
                        <p>01:37</p>
                        <input type="range" id="seek-slider" max="100" value={local_store.SongSeeker} onChange={changeSeeker} style={{backgroundSize: local_store.SongSeeker.toString() + "% 100%"}}/>
                        <p>02:37</p>
                    </div>
                </div>
                <div className="more_controls_cast_and_volume_controller">
                    <motion.div className="more_icon" whileTap={{scale: 0.98}} onClick={props.toggleFloatingLHNState}>
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