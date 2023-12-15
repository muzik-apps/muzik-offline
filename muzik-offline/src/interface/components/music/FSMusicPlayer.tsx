import { motion } from "framer-motion";
import "@styles/components/music/FSMusicPlayer.scss";
import { NullCoverFour, NullCoverOne, NullCoverThree, NullCoverTwo } from "@assets/index";
import { FunctionComponent, useState } from "react";
import { appWindow } from '@tauri-apps/api/window';
import { HistoryUpcoming, MainMusicPlayer } from "@components/index";
import useLocalStorageState from "use-local-storage-state";
import { SavedObject, emptySavedObject } from "@database/index";
import { OSTYPEenum, Player, emptyPlayer } from "types";
import { NullCoverNull } from "@assets/icons";

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
    const [Player,] = useLocalStorageState<Player>("Player-offline", {defaultValue: emptyPlayer});

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

    function getRandomCover(): () => JSX.Element{
        const id = Player.playingSongMetadata?.id;
        const modv: number = id ? id % 4 : 0;
        if(modv === 0)return NullCoverOne;
        else if(modv === 1)return NullCoverTwo;
        else if(modv === 2)return NullCoverThree;
        else return NullCoverFour;
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
                                    {!Player.playingSongMetadata && <NullCoverNull />}{/**no song is loaded onto the player */}
                                    {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={""} alt="song-art" />)}{/**there is cover art */}
                                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover())()}{/**the cover art is null */}
                            </motion.div>)
                        : props.openPlayer && !local_store.AnimateBackground ?
                            <div className="image-container">
                                {!Player.playingSongMetadata && <NullCoverNull />}{/**no song is loaded onto the player */}
                                {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={""} alt="song-art" />)}{/**there is cover art */}
                                {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover())()}{/**the cover art is null */}
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
                                <HistoryUpcoming />
                            </div>
                        </div>
                    </div>
                </div>
        </motion.div>
    )
}

export default FSMusicPlayer