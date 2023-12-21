import { playlist } from 'types';
import { FunctionComponent, useEffect, useState } from 'react';
import { NullCoverNull, EditImage } from '@assets/icons';
import { motion } from 'framer-motion';
import "@styles/components/modals/EditPlaylistModal.scss";
import { compressImage } from 'utils';
import { local_playlists_db } from '@database/database';

type EditPlaylistModalProps = {
    playlistobj: playlist;
    isOpen: boolean;
    closeModal: () => void;
}

const EditPlaylistModal: FunctionComponent<EditPlaylistModalProps> = (props: EditPlaylistModalProps) => {
    const [playlistObj, setPlaylistObj] = useState<playlist>(props.playlistobj);

    function uploadImg(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files === null)return;
        const image = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
            if (e.target?.result) {
                const originalDataUrl = e.target.result as string;
        
              // Compress the image to a maximum size of 250x250
                const compressedDataUrl = await compressImage(originalDataUrl, 250, 250);
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
                            playlistObj.cover === null ? <NullCoverNull /> :
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