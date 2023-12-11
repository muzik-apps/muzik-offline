import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import "@styles/components/buttons/FriendsNavigator.scss";

type FriendsNavigatorProps = {
    icon: () => JSX.Element;
    text: string;
    selected: string;
    select: (arg: string) => void;
}

const FriendsNavigator: FunctionComponent<FriendsNavigatorProps> = (props: FriendsNavigatorProps) => {
    return (
        <motion.div className={"FriendsNavigator " + (props.selected === props.text ? "Selected_FriendsNavigator" : "")} 
            whileTap={{scale: 0.98}}
            onClick={() => {props.select(props.text);}}>
                <h2>{props.text}</h2>
                <props.icon />
        </motion.div>
    )
}

export default FriendsNavigator