import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import "@styles/components/modals/AddFriendModal.scss";

type AddFriendModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    respondAndCloseModal: (idToAdd: string) => void;
}

const AddFriendModal: FunctionComponent<AddFriendModalProps> = (props: AddFriendModalProps) => {
    const [valueText, setValueText] = useState<string>("");

    function captureValue(e: React.ChangeEvent<HTMLInputElement>){
        setValueText(e.target.value);
    }

    return (
        <div className={"AddFriendModal" + (props.isOpen ? " AddFriendModal-visible" : "")} onClick={
                (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                    {if(e.target === e.currentTarget)props.closeModal()}}>
            <div className="modal">
                <h1>Add a new friend</h1>
                <h3>enter their user id here: </h3>
                <input 
                    value={valueText}
                    type="text" 
                    id="AddFriendModalInput"
                    onChange={captureValue}/>
                <h4>their id looks like: #USI794I73039URYIDDIHIKFOP02</h4>
                <motion.div className="submit" whileTap={{scale: 0.98}} onClick={() => props.respondAndCloseModal(valueText)}>
                    send friend request
                </motion.div>
            </div>
        </div>
    )
}

export default AddFriendModal