import { motion } from "framer-motion";
import { getCoverURL, getNullRandomCover } from "utils";
import { OSTYPEenum } from "@muziktypes/index";
import "@styles/components/cards/LargeResizableCover.scss";
import { useSavedObjectStore } from "store";

const variants_cover_users_viewable = {
    large: { width: "250px", height: "250px", marginTop: "-250px" },
    small: { width: "100px", height: "100px", marginTop: "-100px"},
}

const variants_cover_hidden = {large: { width: "250px", height: "250px"},small: { width: "100px", height: "100px"}}

type LargeResizableCoverProps = {
    id: string | undefined;
    resizeHeader: boolean;
    cover: string | null | undefined;
}

const LargeResizableCover = (props: LargeResizableCoverProps) => {

    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    
    return (
        <motion.div className="LargeResizableCover" 
            animate={props.resizeHeader ? "small" : "large"}
            variants={variants_cover_hidden}
            transition={{}}>
            {local_store.OStype !== OSTYPEenum.Linux ?
                <motion.div className="first_cover"
                    animate={props.resizeHeader ? "small" : "large"}
                    variants={variants_cover_hidden}
                    transition={!local_store.Animations ? {} : { type: "spring", stiffness: 100, damping: 14 }}>
                    {props.cover ? <img src={getCoverURL(props.cover)} alt="large-image" /> : 
                        <img src={getCoverURL(getNullRandomCover(props.id ? Number.parseInt(props.id) : 0))} alt="cover-art" />}
                </motion.div>
                : <motion.div className="first_cover" 
                    animate={props.resizeHeader ? "small" : "large"} 
                    variants={variants_cover_hidden}
                    transition={{}}/>
            }
            <motion.div className="second_cover" 
                animate={props.resizeHeader ? "small" : "large"}
                variants={variants_cover_users_viewable}
                transition={!local_store.Animations ? {} : { type: "spring", stiffness: 100, damping: 14 }}>
                {props.cover ? <img src={getCoverURL(props.cover)} alt="large-image" /> : 
                        <img src={getCoverURL(getNullRandomCover(props.id ? Number.parseInt(props.id) : 0))} alt="cover-art" />}
            </motion.div>
        </motion.div>
    )
}

export default LargeResizableCover