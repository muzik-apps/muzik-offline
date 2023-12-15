import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import { DotHorizontal, NullMusicCoverFour, NullMusicCoverOne, NullMusicCoverThree, NullMusicCoverTwo, Play } from "@icons/index";
import "@styles/components/cards/SongCardResizable.scss";

type SongCardResizableProps = {
    cover: any | null;
    songName: string;
    artist: string;
    keyV: number;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
}

const SongCardResizable: FunctionComponent<SongCardResizableProps> = (props: SongCardResizableProps) => {

    function getRandomCover(): () => JSX.Element{
        const modv: number = props.keyV % 4;
        if(modv === 0)return NullMusicCoverOne;
        else if(modv === 1)return NullMusicCoverTwo;
        else if(modv === 2)return NullMusicCoverThree;
        else return NullMusicCoverFour;
    }

    return (
        <>
            <div className="SongCardResizable">
                <motion.div className="song_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    { 
                        !props.cover ? (getRandomCover())()
                        :
                        <img src={props.cover} alt="-img" />
                    }
                </motion.div>
                <div className="song_name">
                    <motion.h3 whileTap={{scale: 0.98}}>{props.songName}</motion.h3>
                    <motion.p whileTap={{scale: 0.98}}>{props.artist}</motion.p>
                </div>
                <motion.div className="svg_app_theme_fill" whileTap={{scale: 0.95}}>
                    <Play />
                </motion.div>
                <motion.div whileTap={{scale: 0.95}} onMouseUp={(e) => {
                    e.preventDefault();
                    props.setMenuOpenData(props.keyV, {xPos: e.pageX - 200, yPos: e.pageY});
                }}>
                    <DotHorizontal />
                </motion.div>
            </div>
        </>
    )
}

export default SongCardResizable