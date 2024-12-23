import { modal_variants } from "@content/index";
import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import { RadioComponent} from "@components/index";
import { getSongFieldsArray } from "@utils/index";
import { invoke } from "@tauri-apps/api/core";
import "@styles/components/modals/ExportModal.scss";

type ExportModalProps = {
    isOpen: boolean;
    song_uuids: string[];
    closeModal: () => void;
}

const fileTypes = ["json", "csv", "xml", "html", "txt"];
const songFields = ["title","artist","album","genre","year","duration","path",
    "date_recorded","date_released","file_size", "file_type","overall_bit_rate",
    "audio_bit_rate","sample_rate","bit_depth","channels"
];

const ExportModal: FunctionComponent<ExportModalProps> = (props: ExportModalProps) => {
    const [selectedExport, setSelectedExport] = useState<string>("json");
    const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(songFields));

    async function createExport(){
        const fields = getSongFieldsArray(selectedFields);
        const invoke_function = selectedExport === "json" ? "export_songs_as_json" : 
                                selectedExport === "csv" ? "export_songs_as_csv" : 
                                selectedExport === "xml" ? "export_songs_as_xml" : 
                                selectedExport === "html" ? "export_songs_as_html" : "export_songs_as_txt";

        await invoke(invoke_function, {uuids: props.song_uuids, fieldsToInclude: fields});
        props.closeModal();
    }

    function replaceAll(str: string, find: string, replace: string): string {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    return (
        <div className={"ExportModal" + (props.isOpen ? " ExportModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)props.closeModal();}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h2>Select fields to include</h2>
                <div className="fields">
                    {
                        songFields.map((field, index) => {
                            return (
                                <RadioComponent 
                                    key={index} 
                                    text={replaceAll(field, "_", " ")}
                                    value={selectedFields.has(field)} 
                                    type="" 
                                    setviewableEl={(value, _) => 
                                        setSelectedFields((prev) => {
                                            const temp = new Set(prev);
                                            if(value) temp.add(field);
                                            else if(temp.size > 1)temp.delete(field);
                                            return temp;
                                    })
                                    } />
                            )
                        })
                    }
                </div>
                <div className="separator"/>
                <div className="export">
                    <h2>Export as</h2>
                    {
                        fileTypes.map((type, index) => {
                            return (
                                <motion.div 
                                    key={index}
                                    className={"export_option " + (selectedExport === type ? "selected" : "")} 
                                    whileTap={{scale: 0.98}} 
                                    onClick={() => setSelectedExport(type)}>
                                        {type}
                                </motion.div>
                            )
                        })
                    }
                </div>
                <div className="buttons">
                    <motion.div className="cancel_button" whileTap={{scale: 0.98}} onClick={props.closeModal}>
                        <h3>Cancel</h3>
                    </motion.div>
                    <motion.div className="save_button" whileTap={{scale: 0.98}} onClick={createExport}>
                        <h3>Export</h3>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default ExportModal