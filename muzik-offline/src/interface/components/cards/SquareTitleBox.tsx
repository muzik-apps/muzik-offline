import { FunctionComponent } from 'react';
import "@styles/components/cards/SquareTitleBox.scss";
import { motion } from 'framer-motion';
import { getRandomCover } from 'utils';

type SquareTitleBoxProps = {
    cover: string | null;
    title: string;
    keyV: string;
    setMenuOpenData: (key: string, co_ords: {xPos: number; yPos: number;}) => void;
    navigateTo: (key: string) => void;
}

const SquareTitleBox: FunctionComponent<SquareTitleBoxProps> = (props: SquareTitleBoxProps) => {

    function navigateTo(){ props.navigateTo(props.keyV); }

    return (
        <div className="SquareTitleBox" onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.setMenuOpenData(props.keyV, {xPos: e.pageX, yPos: e.pageY});
        }}>
            <motion.div className="title_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={navigateTo}>
                    { 
                        !props.cover ? (getRandomCover(props.keyV))()
                        :
                        <img src={props.cover.startsWith("data:image/png;base64,") || props.cover.startsWith("data:image/jpeg;base64,") ? 
                            props.cover :
                            `data:image/png;base64,${props.cover}`} alt="SquareTitleBox-img" />
                    }
            </motion.div>
            <motion.h3 whileTap={{scale: 0.98}} onClick={navigateTo}>{props.title}</motion.h3>
        </div>
    )
}

export default SquareTitleBox