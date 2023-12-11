import { FunctionComponent } from 'react';
import "@styles/components/modals/PersonalDescriptionModal.scss";

type PersonalDescriptionModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    respondAndCloseModal: (text: string) => void;
}

const PersonalDescriptionModal: FunctionComponent<PersonalDescriptionModalProps> = (props: PersonalDescriptionModalProps) => {

    return (
        <div className={"PersonalDescriptionModal" + (props.isOpen ? " PersonalDescriptionModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <textarea 
                className="modal"
                placeholder="Write your personal description here and click anywhere to save and close the modal...">
            </textarea>
        </div>
    )
}

export default PersonalDescriptionModal