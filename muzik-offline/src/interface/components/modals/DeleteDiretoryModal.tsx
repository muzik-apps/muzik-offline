import { motion } from 'framer-motion';
import { modal_variants } from '@content/index';
import React, { FunctionComponent } from 'react'
import { AlertTriangle } from '@assets/icons';
import { useDirStore } from '@store/index';
import "@styles/components/modals/DeletePlaylistModal.scss";

type DeleteDiretoryModalProps = {
    path: string;
    isOpen: boolean;
    closeModal: () => void;
}

const DeleteDiretoryModal: FunctionComponent<DeleteDiretoryModalProps> = (props: DeleteDiretoryModalProps) => {
    const { dir, setDir } = useDirStore((state) => { return { dir: state.dir, setDir: state.setDir}; });

    function deleteDirectory(){
        const newDir = new Set(dir.Dir);
        newDir.delete(props.path);
        setDir({Dir: newDir});
        props.closeModal();
    }

    return (
        <div className={"DeletePlaylistModal" + (props.isOpen ? " DeletePlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
                animate={props.isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="confirm_deletion_modal">
                        <div className="covers">
                            <div className="first_cover "/>
                            <div className="second_cover">
                                <AlertTriangle />
                            </div>
                        </div>
                        <h3>Are you sure you want to delete {props.path} ?</h3>
                        <motion.div whileTap={{scale: 0.95}} className="delete_button" onClick={deleteDirectory}>
                            <h4>delete</h4>
                        </motion.div>
                        <motion.div whileTap={{scale: 0.95}} className="cancel_button" onClick={() => props.closeModal()}>
                            <h4>cancel</h4>
                        </motion.div>
            </motion.div>
        </div>
    )
}

export default DeleteDiretoryModal