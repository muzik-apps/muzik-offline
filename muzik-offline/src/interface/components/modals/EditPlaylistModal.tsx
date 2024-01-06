import { playlist, toastType } from 'types';
import { FunctionComponent, useEffect, useState } from 'react';
import { NullCoverNull, EditImage } from '@assets/icons';
import { motion } from 'framer-motion';
import "@styles/components/modals/EditPlaylistModal.scss";
import { local_playlists_db } from '@database/database';
import { invoke } from "@tauri-apps/api";
import { useToastStore } from 'store';
import { getRandomCover } from 'utils';

type EditPlaylistModalProps = {
    playlistobj: playlist;
    isOpen: boolean;
    closeModal: () => void;
}

const EditPlaylistModal: FunctionComponent<EditPlaylistModalProps> = (props: EditPlaylistModalProps) => {
    const [playlistObj, setPlaylistObj] = useState<playlist>(props.playlistobj);
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
                const compressedDataUrl = await invoke("resize_frontend_image_to_fixed_height",{imageAsStr: toSend, height: 250});
                if(compressedDataUrl === "FAILED"){
                    setToast({title: "Processing error...", message: "Could not process this image, please try another image", type: toastType.error, timeout: 3000});
                    return;
                }
                setPlaylistObj({ ... playlistObj, cover : compressedDataUrl});
            }
        };

        reader.readAsDataURL(image);
    }

    async function savePlaylistAndCloseModal(){
        const PLobj = playlistObj;
        PLobj.dateEdited = new Date().toLocaleDateString();
        //save changes of this playlist
        await local_playlists_db.playlists.update(PLobj.key, PLobj);
        props.closeModal();
    }

    useEffect(() => {   
        setPlaylistObj(props.playlistobj);
    }, [props.isOpen])

    return (
        <div className={"EditPlaylistModal" + (props.isOpen ? " EditPlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <div className="modal">
                <h1>Edit a playlist</h1>
                <div className="playlist_image">
                    <div className="playlist_img">
                        {
                            playlistObj.cover === null ? (getRandomCover(playlistObj.key))() :
                            <img src={playlistObj.cover} alt="playlist_img"/>
                        }
                    </div>
                    <motion.label className="EditImageicon" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}}>
                        <input name="EditImageicon-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
                        <EditImage />
                    </motion.label>
                </div>
                <h3>Playlist name</h3>
                <input type="text" value={playlistObj.title} onChange={(e) => setPlaylistObj({ ... playlistObj, title : e.target.value})}/>
                <motion.div className="edit_playlist" whileTap={{scale: 0.98}} onClick={savePlaylistAndCloseModal}>save changes</motion.div>
            </div>
        </div>
    )
}

export default EditPlaylistModal