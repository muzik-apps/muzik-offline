import { motion } from "framer-motion";
import "@styles/components/music/FSMusicPlayer.scss";
import { FunctionComponent, Suspense, useState, useEffect } from "react";
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { HistoryUpcoming, MainMusicPlayer } from "@components/index";
import { OSTYPEenum } from "@muziktypes/index";
import { Minimize, Overlap } from "@icons/index";
import { useSavedObjectStore, usePlayerStore, useIsFSStore, useIsMaximisedStore } from "store";
import { getCoverURL, getNullRandomCover } from "utils";
const appWindow = getCurrentWebviewWindow()

type FSMusicPlayerProps = {
    openPlayer: boolean;
    closePlayer: () => void;
}

const variants={
    open: {marginTop: "0vh", scale: 1, opacity: 1, borderRadius: "0px"},
    closed: {marginTop: "110vh", scale: 0.7, opacity: 0, borderRadius: "100px"},
}

const variants_list_appearance = {
    open: {opacity: 1},
    closed: {opacity: 0},
}

const FSMusicPlayer: FunctionComponent<FSMusicPlayerProps> = (props: FSMusicPlayerProps) => {

    const [wasMaximized, setWasMaximized] = useState<boolean>(false);
    const [isDoneOpening, setIsDoneOpening] = useState<boolean>(false);
    const [isDoneClosing, setIsDoneClosing] = useState<boolean>(false);
    const { isMaximised } = useIsMaximisedStore((state) => { return { isMaximised: state.isMaximised}; });
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });
    const {Player} = usePlayerStore((state) => { return { Player: state.Player}; });
    const { setappFS, appFS } = useIsFSStore((state) => { return { setappFS: state.setFS, appFS: state.isFS}; });

    async function switchtoFS(){
        const isMaximized: boolean = await appWindow.isMaximized();
        if(isMaximized === true && local_store.OStype === OSTYPEenum.Windows){
            setWasMaximized(true);
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
        
        if(wasMaximized === true && local_store.OStype === OSTYPEenum.Windows){
            setWasMaximized(false);
            appWindow.maximize();
        }
    }

    useEffect(() => {
        if(props.openPlayer === true){
            setIsDoneClosing(false);
            const delay = setTimeout(() => { setIsDoneOpening(true); }, local_store.Animations ? 1000 : 290);
            return () => clearTimeout(delay);
        } else if(props.openPlayer === false){
            setIsDoneOpening(false);
            const delay = setTimeout(() => { setIsDoneClosing(true); }, local_store.Animations ? 1000 : 290);
            return () => clearTimeout(delay);
        }
    }, [props.openPlayer])

    return (
        <div className={
            "FSMusicPlayer-hold " + (props.openPlayer || !isDoneClosing ? " FSMusicPlayer-hold-visible " : "") +
            ((local_store.OStype === OSTYPEenum.Windows || local_store.OStype === OSTYPEenum.Linux) && 
            ((!appFS && !isMaximised) || local_store.AlwaysRoundedCornersWindows === "Yes") ? " FSMusicPlayer-border " : "")}>
            <motion.div className="FSMusicPlayer"
                animate={props.openPlayer ? "open" : "closed"}
                variants={variants}
                transition={(local_store.OStype === OSTYPEenum.Linux || !local_store.Animations) ? {} : { type: "spring", stiffness: 100, damping: 14 }}>
                    <div className="FSMusicPlayer-container">
                        <div className="background-img">
                            {props.openPlayer && isDoneOpening &&
                                <motion.div className={"image-container" + (local_store.Animations ? " rotate" : "")}
                                    animate={props.openPlayer && isDoneOpening ? "open" : "closed"}
                                    variants={variants_list_appearance}>
                                        {!Player.playingSongMetadata && <img src={getCoverURL("NULL_COVER_NULL")} alt="song-art" loading="lazy"/>}
                                        {/**no song is loaded onto the player */}
                                        {Player.playingSongMetadata && Player.playingSongMetadata.cover_uuid && (<img src={getCoverURL(Player.playingSongMetadata.cover_uuid)} alt="song-art" loading="lazy"/>)}
                                        {/**there is cover art */}
                                        {Player.playingSongMetadata && !Player.playingSongMetadata.cover_uuid && <img src={getCoverURL(getNullRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))} alt="song-cover" loading="lazy"/>}
                                        {/**the cover art is null */}
                                </motion.div>}
                        </div>
                        <div className="frontward_facing_player">
                            {local_store.OStype === OSTYPEenum.Windows && appFS === false ?
                                <div className="navbar_container" data-tauri-drag-region>
                                    <div className="navbar_buttons">
                                        {   appFS === false &&
                                                (<motion.div className="close_full_screen_player_btn give-margin" onClick={props.closePlayer} whileTap={{scale: 0.98}}>
                                                    <Minimize /><h3>close</h3>
                                                </motion.div> )
                                        }
                                        <motion.div className="toggle_full_screen_player_btn" onClick={switchtoFS} whileTap={{scale: 0.98}}>
                                            <><Overlap /><h3>fullscreen</h3></>
                                        </motion.div> 
                                    </div>
                                </div>
                                :
                                <div className="navbar_buttons">
                                    {   appFS === false &&
                                            (<motion.div className={"close_full_screen_player_btn" + (appFS === false && " give-margin")} onClick={props.closePlayer} whileTap={{scale: 0.98}}>
                                                <Minimize /><h3>close</h3>
                                            </motion.div> )
                                    }
                                    <motion.div className="toggle_full_screen_player_btn" onClick={appFS === true ? switchtoNONFS : switchtoFS} whileTap={{scale: 0.98}}>
                                        { appFS === false ?  (<><Overlap /><h3>fullscreen</h3></>) : (<><Minimize /><h3>minimize</h3></>) }
                                    </motion.div> 
                                </div>
                            }
                            {props.openPlayer && isDoneOpening &&
                                    <motion.div className="main_visible_content"
                                        animate={props.openPlayer && isDoneOpening ? "open" : "closed"}
                                        variants={variants_list_appearance}>
                                            <div className="main_player">
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    <MainMusicPlayer />
                                                </Suspense>
                                            </div>
                                            <div className="lyrics_history_upcoming">
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    <HistoryUpcoming closePlayer={() => {
                                                        if(appFS === true)switchtoNONFS();
                                                        props.closePlayer();
                                                    }}/>
                                                </Suspense>
                                            </div>
                                    </motion.div>
                            }
                        </div>
                    </div>
            </motion.div>
        </div>
    )
}

export default FSMusicPlayer
