import { FunctionComponent, useState } from "react";
import "@styles/components/modals/DirectoriesModal.scss";

type DirectoriesModalProps = {
    value: string[];
    isOpen: boolean;
    respondAndCloseModal: (text: string[]) => void;
}

const DirectoriesModal: FunctionComponent<DirectoriesModalProps> = (props: DirectoriesModalProps) => {
    const [directories, setDirectories] = useState<string[]>(props.value);

    function setDirectoriesVal(e: React.ChangeEvent<HTMLTextAreaElement>){
        const val: string[] = e.target.value.split(/\s*,\s*/).map(function(item) {
            return item.replace(/\n$/, ''); // Removes trailing newline character
        });;
        setDirectories(val);
    }
    
    return (
        <div className={"DirectoriesModal" + (props.isOpen ? " DirectoriesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.respondAndCloseModal(directories)}}>
            <h2>type in directories as absolute paths, eg C:\songs\</h2>
            <textarea 
                className="modal"
                value={directories.join(", ")}
                onChange={setDirectoriesVal}
                placeholder="directory 1, directory 2, etc
click anywhere to close the modal...">
            </textarea>
        </div>
    )
}

export default DirectoriesModal