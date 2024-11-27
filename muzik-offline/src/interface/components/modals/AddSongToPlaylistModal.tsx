import { local_playlists_db } from "@database/database";
import { toastType } from "@muziktypes/index";
import { useLiveQuery } from "dexie-react-hooks";
import { FunctionComponent, useState } from "react";
import { useToastStore } from "store";
import "@styles/components/modals/AddSongToPlaylistModal.scss";
import { getCoverURL, getNullRandomCover } from "utils";
import { motion } from "framer-motion";
import { modal_variants } from "@content/index";
import CreatePlaylistModal from "./CreatePlaylistModal";

type AddSongToPlaylistModalProps = {
    isOpen: boolean;
    songPath: string;
    closeModal: () => void;
}

const AddSongToPlaylistModal: FunctionComponent<AddSongToPlaylistModalProps> = (props: AddSongToPlaylistModalProps) => {

    const playlists = useLiveQuery(() => local_playlists_db.playlists.toArray()) ?? [];
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const [createPlaylistModal, setCreatePlaylistModal] = useState<boolean>(false);

    function chooseThisPlaylist(key: number){
        //check if track path is already in the playlist
        const pl = playlists.find(playlist => playlist.key === key);
        if(pl === undefined)return;
        if(pl.tracksPaths.includes(props.songPath)){
            //if the track path is already in the playlist, send a toast letting the user know
            setToast({title: "Already in playlist", message: "This song is already in the playlist you selected", type: toastType.warning, timeout: 2000});
            return;
        }
        //if the track path is not in the playlist, add it to the local db playlist
        local_playlists_db.playlists.update(key, {tracksPaths: [...pl.tracksPaths ?? [], props.songPath]});
        props.closeModal();
        setToast({title: "Added to playlist", message: `The song has been added to ${pl.title}`, type: toastType.info, timeout: 2000});
    }

    return (
        <div className={"AddSongToPlaylistModal" + (props.isOpen ? " AddSongToPlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="AddSongToPlaylistModal-modal">
                <h1>Add song to playlist</h1>
                <div className="playlists">
                    {playlists.length === 0 && (<h2>You have no playlists</h2>)}
                    {
                        playlists.map(playlist => 
                            <motion.div className="playlist" key={playlist.key} onClick={() => chooseThisPlaylist(playlist.key)} whileTap={{scale: 0.98}}>
                                <div className="playlist_img">
                                    {  !playlist.cover ? <img src={getCoverURL(getNullRandomCover(playlist.key))} alt="song-cover" /> : <img src={getCoverURL(playlist.cover)} alt="square-image" /> }
                                </div>
                                <h2>{playlist.title}</h2>
                            </motion.div>
                        )
                    }
                </div>
                <motion.div className="create_playlist" whileTap={{scale: 0.98}} onClick={() => {setCreatePlaylistModal(true)}}>Create a playlist</motion.div>
            </motion.div>
            <CreatePlaylistModal isOpen={createPlaylistModal} closeModal={() => {setCreatePlaylistModal(false)}}  />      
            </div>
    )
}

export default AddSongToPlaylistModal