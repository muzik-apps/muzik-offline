import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import "@styles/components/buttons/SettingsNavigator.scss";

type SettingsNavigatorProps = {
    icon: () => JSX.Element;
    title: string;
    selected_setting: string;
    setSelectedSettingF: (arg: string) => void;
}

const SettingsNavigator: FunctionComponent<SettingsNavigatorProps> = (props: SettingsNavigatorProps) => {
    return (
        <motion.div className={"SettingsNavigator " + (props.selected_setting === props.title ? "Selected_Settings_navigator" : "")} 
            whileTap={{scale: 0.98}}
            onClick={() => {props.setSelectedSettingF(props.title);}}>
                <props.icon />
                <h2>{props.title}</h2>
        </motion.div>
    )
}

export default SettingsNavigator