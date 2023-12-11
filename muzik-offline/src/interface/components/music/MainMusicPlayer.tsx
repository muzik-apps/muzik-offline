import { motion } from "framer-motion";
import { artist } from "@assets/index";
import { SkipBack, Pause, SkipFwd, Shuffle, VolumeMin, VolumeMax, Repeat } from "@icons/index";
import "@styles/components/music/MainMusicPlayer.scss";
import useLocalStorageState from "use-local-storage-state";
import { SavedObject, emptySavedObject } from "@database/index";

const MainMusicPlayer = () => {
    const [local_store, setStore] = useLocalStorageState<SavedObject>("SavedObject-offline", {defaultValue: emptySavedObject});

    function changeVolume(event : any){
        setStore({ ... local_store, Volume : event.target.value});
        //do backend rust stuff
    }

    function changeSeeker(event : any){
        setStore({ ... local_store, SongSeeker : event.target.value});
        //do backend rust stuff
    }
    
    return (
        <div className="main_music_player">
            <div className="song_cover_art">
                <div className="first_cover">
                    <img src={artist} alt="first-cover"/>
                </div>
                <div className="second_cover">
                    <img src={artist} alt="second-cover"/>
                </div>
            </div>
            <div className="song_details">
                <h2>Sample Song feat Sample Artist 3, Sample Artist 4</h2>
                <h3>Sample Artist 1 & Sample Artist 2</h3>
            </div>
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
            <div className="volume_controller">
                <motion.div className="volume_icon" whileTap={{scale: 0.98}}>
                    <VolumeMin />
                </motion.div>
                <input type="range" id="volume-slider" value={local_store.Volume} max="100" onChange={changeVolume} style={{backgroundSize: local_store.Volume.toString() + "% 100%"}}/>
                <motion.div className="volume_icon" whileTap={{scale: 0.98}}>
                    <VolumeMax />
                </motion.div>
            </div>
        </div>
    )
}

export default MainMusicPlayer