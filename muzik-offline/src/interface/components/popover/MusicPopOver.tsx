import { motion } from "framer-motion";
import "@styles/components/popover/MusicPopOver.scss";
import { getCoverURL, getNullRandomCover } from "@utils/index";
import { modal_variants } from "@content/index";

type MusicPopOverProps = {
    isOpen: boolean;
    isPlayingSong: boolean;
    songid: number | null;
    cover: string | null;
    name: string | null;
    artist: string | null;
    onClose: (action: "fullscreen" | "miniplayer" | "popover" | "navigateSong" | "navigateArtist") => void;
}

const MusicPopOver = (props: MusicPopOverProps) => {
    return (
        <div className={"MusicPopOver " + (props.isOpen ? " MusicPopOver-visible" : "")} onMouseLeave={() => props.onClose("popover")}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="popover">
                <div className="music_cover_art">
                    {!props.isPlayingSong && <img src={getCoverURL("NULL_COVER_NULL")} alt="song-art" loading="lazy"/>}{/**no song is loaded onto the player */}
                    {props.isPlayingSong && props.cover && (<img src={getCoverURL(props.cover)} alt="song-art" />)}{/**there is cover art */}
                    {props.isPlayingSong && !props.cover && <img src={getCoverURL(getNullRandomCover(props.songid ? props.songid : 0))} alt="song-cover" />}
                    {/**the cover art is null */}
                </div>
                <h2 onClick={() => props.onClose("navigateSong")}>{props.name ? props.name : "No song is playing"}</h2>
                <h3 onClick={() => props.onClose("navigateArtist")}>{props.artist ? props.artist : "No song is playing"}</h3>
                <div className="buttons">
                    <motion.div className="button-left" whileTap={{scale: 0.98}} onClick={() => props.onClose("miniplayer")}>
                        <h3>Miniplayer</h3>
                    </motion.div>
                    <motion.div className="button-right" whileTap={{scale: 0.98}} onClick={() => props.onClose("fullscreen")}>
                        <h3>Fullscreen</h3>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default MusicPopOver