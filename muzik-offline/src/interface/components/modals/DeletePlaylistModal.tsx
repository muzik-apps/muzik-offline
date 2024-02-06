import { modal_variants } from '@content/index';
import { motion } from 'framer-motion';
import { FunctionComponent } from 'react';
import "@styles/components/modals/DeletePlaylistModal.scss";

type DeletePlaylistModalProps = {
    title: string;
    isOpen: boolean;
    closeModal: (deletePlaylist: boolean) => void;
}

const DeletePlaylistModal: FunctionComponent<DeletePlaylistModalProps> = (props: DeletePlaylistModalProps) => {
    return (
        <div className={"DeletePlaylistModal" + (props.isOpen ? " DeletePlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)props.closeModal(false)}}>
            <motion.div 
                animate={props.isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="confirm_deletion_modal">
                    <div className="modal_container">
                        <h3>Are you sure you want to delete {props.title}?</h3>
                        <div className="modal_buttons">
                            <motion.div whileTap={{scale: 0.95}} className="cancel_button" onClick={() => props.closeModal(false)}>
                                <h4>cancel</h4>
                            </motion.div>
                            <motion.div whileTap={{scale: 0.95}} className="delete_button" onClick={() => props.closeModal(true)}>
                                <h4>delete</h4>
                            </motion.div>
                        </div>
                    </div>
            </motion.div>
        </div>
    )
}

export default DeletePlaylistModal