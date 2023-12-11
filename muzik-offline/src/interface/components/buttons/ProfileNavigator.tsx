import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import "@styles/components/buttons/ProfileNavigator.scss";

type ProfileNavigatorProps = {
    icon: () => JSX.Element;
    text: string;
    selected: string;
    select: (arg: string) => void;
}

const ProfileNavigator: FunctionComponent<ProfileNavigatorProps> = (props: ProfileNavigatorProps) => {
    return (
        <motion.div className={"ProfileNavigator " + (props.selected === props.text ? "Selected_ProfileNavigator" : "")} 
            whileTap={{scale: 0.98}}
            onClick={() => {props.select(props.text);}}>
                <h2>{props.text}</h2>
                <props.icon />
        </motion.div>
    )
}

export default ProfileNavigator