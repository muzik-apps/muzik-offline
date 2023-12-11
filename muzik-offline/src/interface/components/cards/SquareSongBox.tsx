import { FunctionComponent } from "react";
import { ExplicitIcon } from "@icons/index";
import { motion } from "framer-motion";
import "@styles/components/cards/SquareSongBox.scss";
import { useNavigate } from "react-router-dom";

type SquareSongBoxProps = {
    cover: string;
    songName: string;
    artist: string;
    explicitStatus: boolean;
    keyV: number;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
}

const SquareSongBox: FunctionComponent<SquareSongBoxProps> = (props: SquareSongBoxProps) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="SquareSongBox" onClick={() => navigate("SongAlbumDetails")} onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.setMenuOpenData(props.keyV, {xPos: e.pageX, yPos: e.pageY});
            }}>
                <motion.div className="song_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    <img src={props.cover} alt="SquareSongBox-img" />
                </motion.div>
                <div className="song_name">
                    <motion.h3 whileTap={{scale: 0.98}}>{props.songName}</motion.h3>
                    {props.explicitStatus && (<ExplicitIcon />)}
                </div>
                <motion.p whileTap={{scale: 0.98}}>{props.artist}</motion.p>
            </div>
        </>
    )
}

export default SquareSongBox