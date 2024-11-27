import { playlist } from 'types';
import { FunctionComponent, useEffect, useState } from 'react';
import { EditImage } from '@assets/icons';
import { motion } from 'framer-motion';
import "@styles/components/modals/EditPlaylistModal.scss";
import { local_playlists_db } from '@database/database';
import { invoke } from "@tauri-apps/api/core";
import { getCoverURL, getNullRandomCover } from 'utils';
import { modal_variants } from '@content/index';
import { DeletePlaylistModal } from '@components/index';
import { useNavigate } from "react-router-dom";
import { useSavedObjectStore, useToastStore } from '@store/index';
import { toastType } from '../../../types/index';

type EditPlaylistModalProps = {
    playlistobj: playlist;
    isOpen: boolean;
    dontNavigate?: boolean;
    closeModal: (key: number | undefined) => void;
}

const EditPlaylistModal: FunctionComponent<EditPlaylistModalProps> = (props: EditPlaylistModalProps) => {
    const [playlistTitle, setPlaylistTitle] = useState<string>(props.playlistobj.title);
    const [deletePlaylistModal, setDeletePlaylistModal] = useState<boolean>(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const navigate = useNavigate();
    const [cover, setCover] = useState<string | null>(null);
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });

    function uploadImg(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files === null)return;
        const image = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            if(e.target?.result){
                const originalData = e.target.result as string;
                setCover(originalData);
            }
        };
        reader.readAsDataURL(image);
    }

    async function savePlaylistAndCloseModal(){
        const playlistObj: playlist = props.playlistobj;
        // check playlist title is not in a windows or unix directory format
        const unix_windows_dir = /([a-zA-Z]:)?(\\[a-zA-Z0-9_.-]+)+\\/g;
        if(unix_windows_dir.test(playlistTitle)){
            setToast({title: "Playlist title", message: "Playlist title cannot contain windows or unix directory format", type: toastType.warning, timeout: 3000});
            return;
        }
        if(playlistTitle !== "")playlistObj.title = playlistTitle;
        playlistObj.dateEdited = new Date().toLocaleDateString();
        //save changes of this playlist
        await local_playlists_db.playlists.update(props.playlistobj.key, playlistObj);
        props.closeModal(playlistObj.key);
        if(cover === null)return;

        let toSend = "";
        
        if(cover.startsWith("data:image/jpeg;base64,")){
            //remove the header of the image
            toSend = cover.replace("data:image/jpeg;base64,", "");
        }
        else if (cover.startsWith("data:image/png;base64,")){
            //remove the header of the image
            toSend = cover.replace("data:image/png;base64,", "");
        }
        // Compress the image to a maximum size of 250x250
        if(toSend === ""){
            setToast({title: "Processing error...", message: "Could not process this image, please try another image", type: toastType.error, timeout: 3000});
            return;
        }

        invoke("create_playlist_cover", {playlistName: playlistTitle, cover: toSend, compressImage: local_store.CompressImage === "Yes" ? true : false})
            .then((cover_uuid: any) => {
                local_playlists_db.playlists.update(props.playlistobj.key, {cover: cover_uuid});
                setToast({title: "Playlist cover", message: "Successfully updated playlist", type: toastType.success, timeout: 3000});
            })
            .catch((error: any) => {
                console.log(error);
                setToast({title: "Playlist cover", message: "Failed to update playlist cover", type: toastType.error, timeout: 3000});
            });
    }

    async function shouldDeletePlaylist(deletePlaylist: boolean){
        if(deletePlaylist){
            await local_playlists_db.playlists.delete(props.playlistobj.key);
            await invoke("delete_playlist_cover", {playlistName: playlistTitle}).then(() => {
                //navigate to playlist page
                if(props.dontNavigate !== undefined && props.dontNavigate === true){
                    props.closeModal(props.playlistobj.key);
                    return;
                }
                navigate("/AllPlaylists");
            });
        }
        else{
            setDeletePlaylistModal(false);
        }
    }

    useEffect(() => {   
        setPlaylistTitle(props.playlistobj.title);
        setCover(null);
        setDeletePlaylistModal(false);
    }, [props.isOpen])

    return (
        <div className={"EditPlaylistModal" + (props.isOpen ? " EditPlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)props.closeModal(undefined)}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h1>Edit a playlist</h1>
                <div className="playlist_image">
                    <div className="playlist_img">
                        {
                            cover !== null ? <img src={cover} alt="playlist_img"/> :
                                props.playlistobj.cover !== null ? <img src={getCoverURL(props.playlistobj.cover)} alt="square-image" /> :
                                <img src={getCoverURL(getNullRandomCover(props.playlistobj.key))} alt="song-cover" />
                        }
                    </div>
                    <motion.label className="EditImageicon" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}}>
                        <input name="EditImageicon-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
                        <EditImage />
                    </motion.label>
                </div>
                <h3>Playlist name</h3>
                <input type="text" id="input-field" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)}/>
                <motion.div className="edit_playlist" whileTap={{scale: 0.98}} onClick={savePlaylistAndCloseModal}>save changes</motion.div>
                <motion.div className="delete_playlist" whileTap={{scale: 0.98}} onClick={() => setDeletePlaylistModal(true)}>delete playlist</motion.div>
            </motion.div>

            <DeletePlaylistModal title={playlistTitle} isOpen={deletePlaylistModal} closeModal={shouldDeletePlaylist}/>
        </div>
    )
}

export default EditPlaylistModal