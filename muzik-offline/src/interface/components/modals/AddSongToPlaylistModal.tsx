import { local_playlists_db } from "@database/database";
import { toastType } from "@muziktypes/index";
import { useLiveQuery } from "dexie-react-hooks";
import { FunctionComponent } from "react";
import { useToastStore } from "store";
import "@styles/components/modals/AddSongToPlaylistModal.scss";
import { getRandomCover } from "utils";
import { motion } from "framer-motion";
import { modal_variants } from "@content/index";

type AddSongToPlaylistModalProps = {
    isOpen: boolean;
    songPath: string;
    closeModal: () => void;
}

const AddSongToPlaylistModal: FunctionComponent<AddSongToPlaylistModalProps> = (props: AddSongToPlaylistModalProps) => {

    const playlists = useLiveQuery(() => local_playlists_db.playlists.toArray()) ?? [];
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

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
            className="modal">
                <h1>Add song to playlist</h1>
                <div className="playlists">
                    {playlists.length === 0 && (<h2>You have no playlists</h2>)}
                    {
                        playlists.map(playlist => 
                            <motion.div className="playlist" key={playlist.key} onClick={() => chooseThisPlaylist(playlist.key)} whileTap={{scale: 0.98}}>
                                <div className="playlist_img">
                                {
                                playlist.cover === null ? 
                                    (getRandomCover(playlist.key.toString()))() 
                                :
                                    (<img src={
                                        playlist.cover.startsWith("data:image/png;base64,") || playlist.cover.startsWith("data:image/jpeg;base64,") ? 
                                        playlist.cover :
                                        `data:image/png;base64,${playlist.cover}`} alt="playlist_img"/>)
                                }
                                </div>
                                <h2>{playlist.title}</h2>
                            </motion.div>
                        )
                    }
                </div>
            </motion.div>
        </div>
    )
}

export default AddSongToPlaylistModal