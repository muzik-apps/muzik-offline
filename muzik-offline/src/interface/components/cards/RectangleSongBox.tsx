import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import { Play } from "@icons/index";
import "@styles/components/cards/RectangleSongBox.scss";
import { getCoverURL, getNullRandomCover } from "utils";

type RectangleSongBoxProps = {
    index: number;
    cover: string | null;
    songName: string;
    artist: string;
    length: number | string;
    year: number;
    selected: boolean;
    keyV: number;
    navigateTo: (key: number, type: "artist" | "song") => void;
    selectThisSong: (index: number) => void;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
    playThisSong: (key: number) => void;
}

const RectangleSongBox: FunctionComponent<RectangleSongBoxProps> = (props: RectangleSongBoxProps) => {

    return (
        <div 
            className={"RectangleSongBox " + (props.selected ? "RectangleSongBox-selected" : "")} 
            onClick={() => props.selectThisSong(props.index)}
            onDoubleClick={() => props.playThisSong(props.keyV)}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.setMenuOpenData(props.keyV, {xPos: e.pageX, yPos: e.pageY});
            }}>
                <p className="index">{props.index}</p>
                <motion.div className="song_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => props.navigateTo(props.keyV, "song")}>
                    {  !props.cover ? 
                        <img src={getCoverURL(getNullRandomCover(props.keyV))} alt="song-cover" />
                        : <img src={getCoverURL(props.cover)} alt="song-cover" /> }
                </motion.div>
                <div className="song_name">
                    <motion.h3 whileTap={{scale: 0.98}} onClick={() => props.navigateTo(props.keyV, "song")}>{props.songName}</motion.h3>
                    <motion.p whileTap={{scale: 0.98}} onClick={() => props.navigateTo(props.keyV, "artist")}>{props.artist}</motion.p>
                </div>
                <p className="length">{props.length}</p>
                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => props.playThisSong(props.keyV)}>
                    <Play/>
                </motion.div>
                <p className="year">{props.year === 0 ? "~" : props.year.toString()}</p>
        </div>
    )
}

export default RectangleSongBox