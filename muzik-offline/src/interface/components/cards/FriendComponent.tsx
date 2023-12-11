import {FunctionComponent} from "react";
import "@styles/components/cards/FriendComponent.scss";
import { motion } from "framer-motion";
import { Empty_user } from "@icons/index";
import { useNavigate } from "react-router-dom";

type FriendComponentProps = {
    profile: string | null;
    name: string | null;
    id: string | null;
}

const FriendComponent : FunctionComponent<FriendComponentProps> = (props: FriendComponentProps) => {
    const navigate = useNavigate();

    return (
        <motion.div 
            className="FriendComponent" 
            onClick={() => navigate("/FriendProfile")} 
            whileTap={{scale: 0.98}}>
                <div className="circular_white_dot"/>
                <div className="user_image">
                    {
                        props.profile === null ? <Empty_user /> 
                        :
                        <img src={props.profile} alt="user-profile"/>
                    }
                </div> 
                <h2>{props.name}</h2>
        </motion.div>
    )
}

export default FriendComponent