import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import "@styles/components/input/DropDownMenuSmall.scss";
import { useSavedObjectStore } from 'store';

type DropDownMenuSmallProps = {
    options: string[];
    isOpen: boolean;
    selectOption: (arg: string) => void;
}

const variants = {
    open: { height: "auto", opacity: 1 },
    closed: {  height: "0", opacity: 0 },
}

const DropDownMenuSmall: FunctionComponent<DropDownMenuSmallProps> = (props: DropDownMenuSmallProps) => {

    const {local_store,} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });
    
    return (
        <motion.div className="DropDownMenuSmall"
            animate={props.isOpen ? "open" : "closed"}
            variants={variants}
            transition={!local_store.Animations ? {} : {type: "spring", stiffness: 100, damping: 15 }}
        >
            { props.isOpen ?
                props.options.map((arg, index) => 
                    <div key={index} onClick={() => props.selectOption(arg)}>
                        <h4 >{arg}</h4>
                    </div>
                )
            :
            <></>
            }
        </motion.div>
    )
}

export default DropDownMenuSmall