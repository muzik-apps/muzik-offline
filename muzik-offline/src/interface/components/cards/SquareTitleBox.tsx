import { FunctionComponent } from 'react';
import "@styles/components/cards/SquareTitleBox.scss";
import { motion } from 'framer-motion';
import { NullCoverFour, NullCoverOne, NullCoverThree, NullCoverTwo } from '@assets/index';

type SquareTitleBoxProps = {
    cover: string | null;
    title: string;
    keyV: number;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
}

const SquareTitleBox: FunctionComponent<SquareTitleBoxProps> = (props: SquareTitleBoxProps) => {

    function getRandomCover(): () => JSX.Element{
        const modv: number = props.keyV % 4;
        if(modv === 0)return NullCoverOne;
        else if(modv === 1)return NullCoverTwo;
        else if(modv === 2)return NullCoverThree;
        else return NullCoverFour;
    }

    return (
        <div className="SquareTitleBox" onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.setMenuOpenData(props.keyV, {xPos: e.pageX, yPos: e.pageY});
        }}>
            <motion.div className="title_cover" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                    { 
                        !props.cover ? (getRandomCover())()
                        :
                        <img src={`data:image/png;base64,${props.cover}`} alt="SquareTitleBox-img" />
                    }
            </motion.div>
            <motion.h3 whileTap={{scale: 0.98}}>{props.title}</motion.h3>
        </div>
    )
}

export default SquareTitleBox