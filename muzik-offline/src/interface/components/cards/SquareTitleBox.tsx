import { FunctionComponent } from 'react';
import "@styles/components/cards/SquareTitleBox.scss";
import { motion } from 'framer-motion';

type SquareTitleBoxProps = {
    cover: string;
    title: string;
    keyV: number;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
}

const SquareTitleBox: FunctionComponent<SquareTitleBoxProps> = (props: SquareTitleBoxProps) => {
    return (
        <div className="SquareTitleBox" onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.setMenuOpenData(props.keyV, {xPos: e.pageX, yPos: e.pageY});
        }}>
            <motion.div className="title_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                <img src={props.cover} alt="SquareTitleBox-img" />
            </motion.div>
            <motion.h3 whileTap={{scale: 0.98}}>{props.title}</motion.h3>
        </div>
    )
}

export default SquareTitleBox