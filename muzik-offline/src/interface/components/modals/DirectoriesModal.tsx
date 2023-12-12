import { FunctionComponent } from "react";
import "@styles/components/modals/DirectoriesModal.scss";

type DirectoriesModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    respondAndCloseModal: (text: string) => void;
}

const DirectoriesModal: FunctionComponent<DirectoriesModalProps> = (props: DirectoriesModalProps) => {
    
    return (
        <div className={"DirectoriesModal" + (props.isOpen ? " DirectoriesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <h2>type in directories as absolute paths, eg C:\songs\</h2>
            <textarea 
                className="modal"
                placeholder="directory 1, directory 2, etc
click anywhere to close the modal...">
            </textarea>
        </div>
    )
}

export default DirectoriesModal