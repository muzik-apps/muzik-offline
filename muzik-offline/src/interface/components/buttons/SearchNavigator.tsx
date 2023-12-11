import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import "@styles/components/buttons/SearchNavigator.scss";

type SearchNavigatorProps = {
    icon: () => JSX.Element;
    text: string;
    selected: string;
    select: (arg: string) => void;
}

const SearchNavigator: FunctionComponent<SearchNavigatorProps>  = (props: SearchNavigatorProps) => {
    return (
        <motion.div className={"SearchNavigator " + (props.selected === props.text ? "Selected_SearchNavigator" : "")} 
            whileTap={{scale: 0.98}}
            onClick={() => {props.select(props.text);}}>
                <props.icon />
                <h2>{props.text}</h2>
        </motion.div>
    )
}

export default SearchNavigator