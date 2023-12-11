import { motion } from "framer-motion";
import "@styles/components/cards/FriendCard.scss";
import { Check, Cross, UserProfileAdd, UserProfileX } from "@assets/icons";
import { useNavigate } from "react-router-dom";

type FriendCardProps = {
    profile: string;
    name: string;
    selected: boolean;
    index: number;
    isFriend?: boolean;
    selectThisPerson: (index: number) => void;
    revokeFriendship?: () => void;
    friendshipRequestAction?: () => void;
}

const FriendCard = (props: FriendCardProps) => {
    const navigate = useNavigate();

    return (
        <div className={"FriendCard " + (props.selected ? "FriendCard-selected" : "")} 
            onClick={() => props.selectThisPerson(props.index)}>
                <motion.div 
                    className="profile_img" 
                    whileHover={{scale: 1.02}} 
                    whileTap={{scale: 0.98}}
                    onClick={() => navigate("/FriendProfile")}>
                        <img src={props.profile} alt="profile_img-img" />
                </motion.div>
                <h2 onClick={() => navigate("/FriendProfile")}>{props.name}</h2>
                {
                    props.revokeFriendship && (
                        !props.isFriend ? 
                        <motion.div className="remove-friend" whileTap={{scale: 0.98}} onClick={props.revokeFriendship}>
                            <UserProfileX />
                        </motion.div>
                        :
                        <motion.div className="add-friend" whileTap={{scale: 0.98}} onClick={props.revokeFriendship}>
                            <UserProfileAdd />
                        </motion.div>
                    )
                }
                {
                    props.friendshipRequestAction && (
                        <div className="friendshipRequestAction">
                            <motion.div className="accept-request" whileTap={{scale: 0.98}} onClick={props.revokeFriendship}>
                                <Check />
                            </motion.div>
                            <motion.div className="reject-request" whileTap={{scale: 0.98}} onClick={props.revokeFriendship}>
                                <Cross />
                            </motion.div>
                        </div>
                    )
                }
        </div>
    )
}

export default FriendCard