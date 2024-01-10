import { motion } from "framer-motion";
import "@styles/components/music/FSMusicPlayer.scss";
import { FunctionComponent, Suspense, useState, useEffect } from "react";
import { appWindow } from '@tauri-apps/api/window';
import { HistoryUpcoming, MainMusicPlayer } from "@components/index";
import { OSTYPEenum } from "@muziktypes/index";
import { Minimize, NullCoverNull, Overlap } from "@icons/index";
import { useSavedObjectStore, usePlayerStore } from "store";
import { getRandomCover } from "utils";

type FSMusicPlayerProps = {
    openPlayer: boolean;
    closePlayer: () => void;
}

const variants={
    open: {bottom: "-10vh", scale: 1, opacity: 1, borderRadius: "0px"},
    closed: {bottom: "-110vh", scale: 0.7, opacity: 0.5, borderRadius: "100px"},
}

const variants_list_appearance = {
    open: {opacity: 1},
    closed: {opacity: 0},
}

const FSMusicPlayer: FunctionComponent<FSMusicPlayerProps> = (props: FSMusicPlayerProps) => {

    const [wasMaximized, setMaximized] = useState<boolean>(false);
    const [appFS, setappFS] = useState<boolean>(false);
    const [isDoneOpening, setIsDoneOpening] = useState<boolean>(false);
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });
    const {Player} = usePlayerStore((state) => { return { Player: state.Player}; });

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

    useEffect(() => {
        if(props.openPlayer === true){
            const delay = setTimeout(() => { setIsDoneOpening(true); }, local_store.Animations ? 1000 : 290);
            return () => clearTimeout(delay);
        }
        else setIsDoneOpening(false);
    }, [props.openPlayer])

    return (
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
                                    {!Player.playingSongMetadata && <NullCoverNull />}
                                    {/**no song is loaded onto the player */}
                                    {Player.playingSongMetadata && Player.playingSongMetadata.cover && (<img src={`data:image/png;base64,${Player.playingSongMetadata.cover}`} alt="song-art" loading="lazy"/>)}
                                    {/**there is cover art */}
                                    {Player.playingSongMetadata && !Player.playingSongMetadata.cover && (getRandomCover(Player.playingSongMetadata ? Player.playingSongMetadata.id : 0))()}
                                    {/**the cover art is null */}
                            </motion.div>}
                    </div>
                    <div className="frontward_facing_player">
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
                                                <HistoryUpcoming closePlayer={props.closePlayer} />
                                            </Suspense>
                                        </div>
                                </motion.div>
                        }
                    </div>
                </div>
        </motion.div>
    )
}

export default FSMusicPlayer