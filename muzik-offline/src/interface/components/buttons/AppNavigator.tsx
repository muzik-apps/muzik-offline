import {FunctionComponent} from "react";
import "@styles/components/buttons/AppNavigator.scss";
import { motion } from "framer-motion";

type AppNavigatorProps = {
    icon: () => JSX.Element;
    text: string;
    selected_panel: string;
    setSelectedPanelF: (arg: string) => void;
};

const AppNavigator : FunctionComponent<AppNavigatorProps> = (props: AppNavigatorProps) => {
    return (
        <motion.div className={"App_navigator " + (props.selected_panel === props.text ? "Selected_App_navigator" : "")} 
            whileTap={{scale: 0.98}}
            onClick={() => {props.setSelectedPanelF(props.text);}}>
                <props.icon />
                <h2>{props.text}</h2>
        </motion.div>
    )
}

export default AppNavigator