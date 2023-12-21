import { motion } from "framer-motion";
import { getRandomCover } from "utils";
import "@styles/components/cards/LargeResizableCover.scss";

const variants_cover_users_viewable = {
    large: { width: "250px", height: "250px", marginTop: "-250px" },
    small: { width: "100px", height: "100px", marginTop: "-100px"},
}

const variants_cover_hidden = {large: { width: "250px", height: "250px"},small: { width: "100px", height: "100px"}}

type LargeResizableCoverProps = {
    id: string | undefined;
    resizeHeader: boolean;
    cover: string | null;
}

const LargeResizableCover = (props: LargeResizableCoverProps) => {
    return (
        <motion.div className="LargeResizableCover" 
            animate={props.resizeHeader ? "small" : "large"}
            variants={variants_cover_hidden}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}>
            <motion.div className="first_cover"
                animate={props.resizeHeader ? "small" : "large"}
                variants={variants_cover_hidden}
                transition={{ type: "spring", stiffness: 100, damping: 14 }}>
                {
                    props.cover ?
                        <img src={props.cover.startsWith("data:image/png;base64,") || props.cover.startsWith("data:image/jpeg;base64,") ? 
                            props.cover :
                            `data:image/png;base64,${props.cover}`} alt="first-cover"/>
                    :
                    getRandomCover(props.id ? Number.parseInt(props.id) : 0)()
                }
            </motion.div>
            <motion.div className="second_cover" 
                animate={props.resizeHeader ? "small" : "large"}
                variants={variants_cover_users_viewable}
                transition={{ type: "spring", stiffness: 100, damping: 14 }}>
                {
                    props.cover ?
                        <img src={props.cover.startsWith("data:image/png;base64,") || props.cover.startsWith("data:image/jpeg;base64,") ? 
                            props.cover :
                            `data:image/png;base64,${props.cover}`} alt="second-cover"/>
                    :
                    getRandomCover(props.id ? Number.parseInt(props.id) : 0)()
                }
            </motion.div>
        </motion.div>
    )
}

export default LargeResizableCover