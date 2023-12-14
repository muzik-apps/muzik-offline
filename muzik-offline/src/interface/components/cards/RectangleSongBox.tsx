import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import { NullMusicCoverOne, NullMusicCoverTwo, NullMusicCoverThree, NullMusicCoverFour, Play } from "@icons/index";
import "@styles/components/cards/RectangleSongBox.scss";

type RectangleSongBoxProps = {
    index: number;
    cover: string;
    songName: string;
    artist: string;
    length: number | string;
    year: number;
    selected: boolean;
    keyV: number;
    selectThisSong: (index: number) => void;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
}

const RectangleSongBox: FunctionComponent<RectangleSongBoxProps> = (props: RectangleSongBoxProps) => {

    function getRandomCover(){
        const modv: number = props.index % 4;
        if(modv === 0)return NullMusicCoverOne;
        else if(modv === 1)return NullMusicCoverTwo;
        else if(modv === 2)return NullMusicCoverThree;
        else return NullMusicCoverFour;
    }

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
                    { !props.cover || props.cover === "No cover" ?
                        (getRandomCover())()
                        :
                        <img src={props.cover} alt="SquareSongBox-img" />
                    }
                </motion.div>
                <div className="song_name">
                    <motion.h3 whileTap={{scale: 0.98}}>{props.songName}</motion.h3>
                    <motion.p whileTap={{scale: 0.98}}>{props.artist}</motion.p>
                </div>
                <p className="length">{props.length}</p>
                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    <Play/>
                </motion.div>
                <p className="year">{props.year === 0 ? "~" : props.year.toString()}</p>
        </div>
    )
}

export default RectangleSongBox