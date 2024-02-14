import { motion } from "framer-motion";
import { Song, playlist } from "@muziktypes/index";
import "@styles/components/modals/PropertiesModal.scss";
import { invoke } from "@tauri-apps/api";
import { modal_variants } from "@content/index";
import { FunctionComponent } from "react";

type PropertiesModalProps = {
    song?: Song;
    playlist?: playlist;
    isOpen: boolean;
    closeModal: () => void;
}

const PropertiesModal: FunctionComponent<PropertiesModalProps> = (props: PropertiesModalProps) => {

    function formatBytes(bytes: number, decimals: number = 0) {
        if (!+bytes) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function openFileLocation(){
        if(props.song){
            invoke("open_in_file_manager", { filePath: props.song.path });
        }
    }

    return (
        <div className={"PropertiesModal" + (props.isOpen ? " PropertiesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h2>Properties</h2>
                { props.song && 
                    <div className="properties_grid">
                        <div className="properties_grid_item">
                            <h3>In-app ID</h3>
                            <p>{props.song.id}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Title</h3>
                            <p>{props.song.title}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Artist</h3>
                            <p>{props.song.artist}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Album</h3>
                            <p>{props.song.album}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Genre</h3>
                            <p>{props.song.genre}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Year</h3>
                            <p>{props.song.year}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Duration</h3>
                            <p>{props.song.duration}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Path</h3>
                            <p>{props.song.path}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Date recorded</h3>
                            <p>{props.song.date_recorded}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Date released</h3>
                            <p>{props.song.date_released}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>File size</h3>
                            <p>{formatBytes(props.song.file_size)}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>File type</h3>
                            <p>{props.song.file_type}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Overall bit rate</h3>
                            <p>{props.song.overall_bit_rate}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Audio bit rate</h3>
                            <p>{props.song.audio_bit_rate}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Sample rate</h3>
                            <p>{props.song.sample_rate}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Bit depth</h3>
                            <p>{props.song.bit_depth}</p>
                        </div>
                        <div className="properties_grid_item">
                            <h3>Channels</h3>
                            <p>{props.song.channels}</p>
                        </div>
                        <div className="properties_grid_item">
                            <motion.h4 onClick={openFileLocation}>Open file location</motion.h4>
                        </div>
                    </div>
                }
                { props.playlist &&
                    <div className="playlist_songs_paths">
                        <div className="playlist_metadata">
                            <div className="properties_grid_item">
                                <h3>Name</h3>
                                <p>{props.playlist.title}</p>
                            </div>
                            <div className="properties_grid_item">
                                <h3>Date created</h3>
                                <p>{props.playlist.dateCreated}</p>
                            </div>
                            <div className="properties_grid_item">
                                <h3>Date edited</h3>
                                <p>{props.playlist.dateEdited}</p>
                            </div>
                        </div>
                        <h3>Playlist songs paths</h3>
                        <div className="playlist_songs_paths_list">
                            {
                                props.playlist.tracksPaths.length === 0 &&
                                <p>There are no songs in this playlist</p>
                            }
                            {
                                props.playlist.tracksPaths.map((trackPath, index) => 
                                    <div className="playlist_songs_paths_list_item" key={index}>
                                        <p>{trackPath}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
            </motion.div>
        </div>
    )
}

export default PropertiesModal