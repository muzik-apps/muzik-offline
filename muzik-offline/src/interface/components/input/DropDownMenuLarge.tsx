import { motion } from "framer-motion";
import { FunctionComponent } from "react";
import "@styles/components/input/DropDownMenuLarge.scss";
import { selectedGeneralSettingEnum } from "types";
import { useSavedObjectStore } from "store";

type DropDownMenuLargeProps = {
    options: string[];
    type: selectedGeneralSettingEnum;
    isOpen: boolean;
    selectOption: (arg: string, type: string) => void;
}

const variants = {
    open: { height: "auto", opacity: 1 },
    closed: {  height: "0", opacity: 0 },
}

const DropDownMenuLarge: FunctionComponent<DropDownMenuLargeProps> = (props: DropDownMenuLargeProps) => {

    const {local_store,} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });

    return (
        <motion.div className="DropDownMenuLarge"
            animate={props.isOpen ? "open" : "closed"}
            variants={variants}
            transition={!local_store.Animations ? {} : {type: "spring", stiffness: 100, damping: 9 }}
        >
            { props.isOpen ?
                props.options.map((arg, index) => 
                    <div key={index} onClick={() => props.selectOption(arg, props.type)}>
                        <h4 >{arg}</h4>
                    </div>
                )
            :
            <></>
            }
        </motion.div>
    )
}

export default DropDownMenuLarge