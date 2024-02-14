import { FunctionComponent } from "react";
import { motion } from "framer-motion";
import { Song, playlist } from "@muziktypes/index";
import "@styles/components/modals/PropertiesModal.scss";
import { invoke } from "@tauri-apps/api";
import { modal_variants } from "@content/index";

type EditPropertiesModalProps = {
    song: Song;
    isOpen: boolean;
    closeModal: () => void;
}

const EditPropertiesModal: FunctionComponent<EditPropertiesModalProps> = (props: EditPropertiesModalProps) => {
    return (
        <div className="">

        </div>
    )
}

export default EditPropertiesModal