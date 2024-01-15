import { EditImage } from "@assets/icons";
import { playlist, toastType } from "@muziktypes/index";
import { motion } from "framer-motion";
import { FunctionComponent, useEffect, useState } from "react";
import { local_playlists_db } from "@database/database";
import "@styles/components/modals/CreatePlaylistModal.scss";
import { invoke } from "@tauri-apps/api";
import { useToastStore } from "store";
import { modal_variants } from "@content/index";

type CreatePlaylistModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

const CreatePlaylistModal : FunctionComponent<CreatePlaylistModalProps> = (props: CreatePlaylistModalProps) => {
    const [playlistObj, setPlaylistObj] = useState<playlist>({key: 0,cover: null,title: "",dateCreated: "",dateEdited: "",tracksPaths: []});
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    function uploadImg(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files === null)return;
        const image = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            if (e.target?.result) {
                const originalDataUrl = e.target.result as string;
                let toSend = "";
        
                if(originalDataUrl.startsWith("data:image/jpeg;base64,")){
                    //remove the header of the image
                    toSend = originalDataUrl.replace("data:image/jpeg;base64,", "");
                }
                else if (originalDataUrl.startsWith("data:image/png;base64,")){
                    //remove the header of the image
                    toSend = originalDataUrl.replace("data:image/png;base64,", "");
                }
                // Compress the image to a maximum size of 250x250
                if(toSend === ""){
                    setToast({title: "Processing error...", message: "Could not process this image, please try another image", type: toastType.error, timeout: 3000});
                    return;
                }
        
                // Compress the image to a maximum size of 250x250
                const compressedDataUrl = await invoke("resize_frontend_image_to_fixed_height",{imageAsStr: originalDataUrl, height: 250});
                if(compressedDataUrl === "FAILED"){
                    setToast({title: "Processing error...", message: "Could not process this image, please try another image", type: toastType.error, timeout: 3000});
                    return;
                }
                setPlaylistObj({ ... playlistObj, cover : compressedDataUrl});
            }
        };

        reader.readAsDataURL(image);
    }

    async function createPlaylistAndCloseModal(){
        const PLobj = playlistObj;
        PLobj.dateCreated = new Date().toLocaleDateString();
        PLobj.dateEdited = new Date().toLocaleDateString();
        //set key of PLobj as the last key in the database + 1
        const last_key = await local_playlists_db.playlists.orderBy("key").last();
        PLobj.key = last_key ? last_key.key + 1 : 0;
        await local_playlists_db.playlists.add(PLobj);
        props.closeModal();
    }
    
    useEffect(() => {   
        setPlaylistObj({key: 0,cover: null,title: "",dateCreated: "",dateEdited: "",tracksPaths: []});
    }, [props.isOpen])

    return (
        <div className={"CreatePlaylistModal" + (props.isOpen ? " CreatePlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h1>Create a playlist</h1>
                <div className="playlist_image">
                    <div className="playlist_img">
                        {
                            playlistObj.cover === null ? <div className="blank_cover"/> :
                            <img src={playlistObj.cover} alt="playlist_img"/>
                        }
                    </div>
                    <motion.label className="EditImageicon" whileTap={{scale: 0.97}}>
                        <input name="EditImageicon-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
                        <EditImage />
                    </motion.label>
                </div>
                <h3>Playlist name</h3>
                <input type="text" value={playlistObj.title} onChange={(e) => setPlaylistObj({ ... playlistObj, title : e.target.value})}/>
                <motion.div className="create_playlist" whileTap={{scale: 0.98}} onClick={createPlaylistAndCloseModal}>create playlist</motion.div>
            </motion.div>
        </div>
    )
}

export default CreatePlaylistModal