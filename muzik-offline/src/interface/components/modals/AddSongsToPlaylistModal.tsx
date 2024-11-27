import { modal_variants } from "@content/index";
import { local_playlists_db } from "@database/database";
import { toastType } from "@muziktypes/index";
import { useToastStore } from "@store/index";
import { getCoverURL, getNullRandomCover, getSongPaths } from "@utils/index";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import "@styles/components/modals/AddSongToPlaylistModal.scss";
import { useState } from "react";
import CreatePlaylistModal from "./CreatePlaylistModal";

type AddSongsToPlaylistModalProps = {
    isOpen: boolean;
    title: string;
    values: {album?: string, artist?: string, genre?: string, playlist?: string};
    closeModal: () => void;
}

const AddSongsToPlaylistModal = (props: AddSongsToPlaylistModalProps) => {

    const playlists = useLiveQuery(() => local_playlists_db.playlists.toArray()) ?? [];
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const [createPlaylistModal, setCreatePlaylistModal] = useState<boolean>(false);

    async function chooseThisPlaylist(key: number){
        //check if track path is already in the playlist
        const pl = playlists.find(playlist => playlist.key === key);
        if(pl === undefined)return;
        const paths: string[] = await getSongPaths(props.values);
        const set_a = new Set(pl.tracksPaths);
        const values_not_in_a = paths.filter(value => !set_a.has(value));
        //add the paths to the local db playlist with the given key
        local_playlists_db.playlists.update(key, {tracksPaths: [...pl.tracksPaths ?? [], ...values_not_in_a]});
        props.closeModal();
        const message = `Songs from ${props.title} have been added to ${pl.title} ` + (paths.length !== values_not_in_a.length ? `but some were already in the playlist` : ``);
        setToast({title: "Added to playlist", message: message, type: toastType.info, timeout: 5000});
    }
    
    return (
        <div className={"AddSongToPlaylistModal" + (props.isOpen ? " AddSongToPlaylistModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="AddSongToPlaylistModal-modal">
                <h1>Add to playlist</h1>
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

export default AddSongsToPlaylistModal