import { motion } from "framer-motion";
import "@styles/components/music/FSMusicPlayer.scss";
import { artist } from "@assets/index";
import { FunctionComponent, useState } from "react";
import { appWindow } from '@tauri-apps/api/window';
import { LyricsHistoryUpcoming, MainMusicPlayer } from "@components/index";
import useLocalStorageState from "use-local-storage-state";
import { SavedObject, emptySavedObject } from "@database/index";
import { OSTYPEenum } from "types";

type FSMusicPlayerProps = {
    openPlayer: boolean;
    closePlayer: () => void;
}

const variants={
    open: {bottom: "-10vh"},
    closed: {bottom: "-110vh"},
}

const FSMusicPlayer: FunctionComponent<FSMusicPlayerProps> = (props: FSMusicPlayerProps) => {

    const [wasMaximized, setMaximized] = useState<boolean>(false);
    const [appFS, setappFS] = useState<boolean>(false);
    const [local_store,] = useLocalStorageState<SavedObject>("SavedObject-offline", {defaultValue: emptySavedObject});

    async function switchtoFS(){
        const isMaximized: boolean = await appWindow.isMaximized();
        if(isMaximized === true){
            setMaximized(true);
            appWindow.unmaximize();
        }
        appWindow.setFullscreen(true);
        appWindow.setResizable(false);
        setappFS(true);
    }

    function switchtoNONFS(){
        appWindow.setFullscreen(false);
        appWindow.setResizable(true);
        setappFS(false);

        if(wasMaximized === true){
            setMaximized(false);
            appWindow.maximize();
        }
    }

    return (
        <motion.div className="FSMusicPlayer"
            animate={props.openPlayer ? "open" : "closed"}
            variants={variants}
            transition={local_store.OStype === OSTYPEenum.Linux ? {type: "spring", duration: 0} : { type: "spring", stiffness: 100, damping: 14 }}>
                <div className="FSMusicPlayer-container">
                    <div className="background-img">
                        {props.openPlayer && local_store.AnimateBackground ? 
                            (<motion.div 
                                className="image-container"
                                animate={{ rotate: 360 }}
                                transition={{ ease: "linear", duration: 40, repeat: Infinity, repeatType: "reverse"}}>
                                    <img src={artist} alt="song-cover-art"/>
                            </motion.div>)
                        : props.openPlayer && !local_store.AnimateBackground ?
                            <div className="image-container">
                                <img src={artist} alt="song-cover-art"/>
                            </div>
                        :
                            <></>
                        }
                    </div>
                    <div className="frontward_facing_player">
                        <div className="navbar_buttons">
                            {   appFS === true ? 
                                    (<></>)
                                :
                                    (<motion.div className="close_full_screen_player_btn" onClick={props.closePlayer} whileTap={{scale: 0.98}}>
                                        <h2>close player</h2>
                                    </motion.div> )
                            }
                            <motion.div className="toggle_full_screen_player_btn" onClick={appFS === true ? switchtoNONFS : switchtoFS} whileTap={{scale: 0.98}}>
                                { appFS === true ? 
                                    (<h2>minimize player</h2>)
                                    : 
                                    (<h2>maximize player</h2>)
                                }
                            </motion.div> 
                        </div>
                        <div className="main_visible_content">
                            <div className="main_player">
                                <MainMusicPlayer />
                            </div>
                            <div className="lyrics_history_upcoming">
                                <LyricsHistoryUpcoming />
                            </div>
                        </div>
                    </div>
                </div>
        </motion.div>
    )
}

export default FSMusicPlayer