import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import { DotHorizontal, Play } from "@icons/index";
import "@styles/components/cards/SongCardResizable.scss";
import { getCoverURL, getNullRandomCover } from '@utils/index';

type SongCardResizableProps = {
    cover: string | null;
    songName: string;
    artist: string;
    keyV: number;
    navigateTo: (key: number, type: "artist" | "song") => void;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
    playThisSong: (key: number) => void;
}

const SongCardResizable: FunctionComponent<SongCardResizableProps> = (props: SongCardResizableProps) => {

    return (
        <div className="SongCardResizable">
            <motion.div className="song_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                { !props.cover ? <img src={getCoverURL(getNullRandomCover(props.keyV))} alt="song-cover" /> : <img src={getCoverURL(props.cover)} alt="song-card" /> }
            </motion.div>
            <div className="song_name">
                <motion.h3 whileTap={{scale: 0.98}} onClick={() => props.navigateTo(props.keyV, "song")}>{props.songName}</motion.h3>
                <motion.p whileTap={{scale: 0.98}} onClick={() => props.navigateTo(props.keyV, "artist")}>{props.artist}</motion.p>
            </div>
            <motion.div className="PlayIcon" whileTap={{scale: 0.95}} onMouseUp={() => props.playThisSong(props.keyV)}>
                <Play />
            </motion.div>
            <motion.div whileTap={{scale: 0.95}} className="DotHorizontalIcon" 
                onMouseUp={(e) => {props.setMenuOpenData(props.keyV, {xPos: e.pageX - 200, yPos: e.pageY});}}>
                <DotHorizontal />
            </motion.div>
        </div>
    )
}

export default SongCardResizable