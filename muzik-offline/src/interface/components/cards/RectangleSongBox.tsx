import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import { ExplicitIcon, Heart, HeartFull, Play } from "@icons/index";
import "@styles/components/cards/RectangleSongBox.scss";

type RectangleSongBoxProps = {
    index: number;
    cover: string;
    songName: string;
    artist: string;
    explicitStatus: boolean;
    length: number | string;
    hearted: boolean;
    selected: boolean;
    keyV: number;
    selectThisSong: (index: number) => void;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
}

const RectangleSongBox: FunctionComponent<RectangleSongBoxProps> = (props: RectangleSongBoxProps) => {
    return (
        <div 
            className={"RectangleSongBox " + (props.selected ? "RectangleSongBox-selected" : "")} 
            onClick={() => props.selectThisSong(props.index)}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.setMenuOpenData(props.keyV, {xPos: e.pageX, yPos: e.pageY});
            }}>
                <p className="index">{props.index}</p>
                <motion.div className="song_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    <img src={props.cover} alt="SquareSongBox-img" />
                </motion.div>
                <div className="song_name">
                    <motion.h3 whileTap={{scale: 0.98}}>{props.songName}</motion.h3>
                    <motion.p whileTap={{scale: 0.98}}>{props.artist}</motion.p>
                </div>
                {props.explicitStatus && (
                    <div className="ExplicitIcon">
                        <ExplicitIcon />
                    </div>
                )}
                <motion.p className="length" whileTap={{scale: 0.98}}>{props.length}</motion.p>
                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    <Play/>
                </motion.div>
                {   props.hearted ?
                    <motion.div className="HeartFullIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                        <HeartFull />
                    </motion.div>
                    :
                    <motion.div className="HeartIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                            <Heart />
                    </motion.div>
                }
        </div>
    )
}

export default RectangleSongBox