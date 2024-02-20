import { FunctionComponent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Song, toastType } from "@muziktypes/index";
import "@styles/components/modals/EditPropertiesModal.scss";
import { invoke } from "@tauri-apps/api";
import { modal_variants } from "@content/index";
import { getRandomCover } from "@utils/index";
import { useToastStore } from "@store/index";
import { local_songs_db } from "@database/database";

type EditPropertiesModalProps = {
    song: Song | null;
    isOpen: boolean;
    closeModal: () => void;
}

const EditPropertiesModal: FunctionComponent<EditPropertiesModalProps> = (props: EditPropertiesModalProps) => {

    const [song, setSong] = useState<Song>({
            id: 0,
            title: "",
            name: "",
            artist: "",
            album: "",
            genre: "",
            year: 0,
            duration: "",
            duration_seconds: 0,
            path: "",
            cover: null,
            date_recorded: "",
            date_released: "",
            file_size: 0,
            file_type: "",
            overall_bit_rate: 0,
            audio_bit_rate: 0,
            sample_rate: 0,
            bit_depth: 0,
            channels: 0
        });
    const [isid3Supported, setISid3Supported] = useState<boolean>(false);
    const [hasChangedCover, setHasChangedCover] = useState<boolean>(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    function uploadImg(e: any){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.addEventListener('load', () => {
            let cover = reader.result === null ? null : reader.result.toString();
            if(cover !== null){
                if(cover.startsWith("data:image/jpeg;base64,")){
                    //remove the header of the image
                    cover = cover.replace("data:image/jpeg;base64,", "");
                }
                else if (cover.startsWith("data:image/png;base64,")){
                    //remove the header of the image
                    cover = cover.replace("data:image/png;base64,", "");
                }
            }
            setSong({...song, cover});
            setHasChangedCover(true);
        });
    }

    function saveChanges(){
        const song_v = song;
        props.closeModal();

        invoke("edit_song_metadata", {songPath: song_v.path, songMetadata: JSON.stringify(song_v), hasChangedCover: hasChangedCover}).
        then(async() => { 
            await local_songs_db.songs.update(song_v.id, song_v);
            setToast({ title: "Editing song...", message: "Successfully updated metadata", type: toastType.success, timeout: 3000 });
        }).
        catch((e) => { setToast({ title: "Editing song...", message: e, type: toastType.error, timeout: 5000 }); });
    }

    useEffect(() => {
        setISid3Supported(props.song !== null && (props.song.file_type === "mp3" || props.song.file_type === "wav" || props.song.file_type === "aiff") ? true : false);
        setSong(props.song === null ? 
            {
                id: 0,
                title: "",
                name: "",
                artist: "",
                album: "",
                genre: "",
                year: 0,
                duration: "",
                duration_seconds: 0,
                path: "",
                cover: null,
                date_recorded: "",
                date_released: "",
                file_size: 0,
                file_type: "",
                overall_bit_rate: 0,
                audio_bit_rate: 0,
                sample_rate: 0,
                bit_depth: 0,
                channels: 0
            }
            : props.song)
    }, [props.song])

    return (
        <div className={"EditPropertiesModal" + (props.isOpen ? " EditPropertiesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)saveChanges()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h2>Edit Properties</h2>
                <div className="properties_grid">
                    { isid3Supported && 
                        <div className="properties_grid_item">
                            <h3>Add Cover</h3>
                            <div className="img-container-and-upload">
                                <div className="img-container">
                                    {
                                        song.cover === null ? (getRandomCover(song.id))() :
                                        <img src={song.cover.startsWith("data:image/png;base64,") || song.cover.startsWith("data:image/jpeg;base64,") ? 
                                            song.cover :`data:image/png;base64,${song.cover}`} alt="img" />
                                    }
                                </div>
                                <motion.label className="button_select" whileHover={{scale: 1.03}} whileTap={{scale: 0.98}}>
                                    <input name="background-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
                                    upload
                                </motion.label>
                            </div>
                        </div>
                    }
                    <div className="properties_grid_item">
                        <h3>Edit Title</h3>
                        <input type="text" value={song.title} onChange={(e) => setSong({...song, title: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Artist</h3>
                        <input type="text" value={song.artist} onChange={(e) => setSong({...song, artist: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Album</h3>
                        <input type="text" value={song.album} onChange={(e) => setSong({...song, album: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Genre</h3>
                        <input type="text" value={song.genre} onChange={(e) => setSong({...song, genre: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Year</h3>
                        <input type="text" value={song.year} onChange={(e) => setSong({...song, year: Number.parseInt(e.target.value)})}/>
                    </div>
                    { isid3Supported && 
                        <div className="properties_grid_item">
                            <h3>Edit Date recorded "YYYY-MM-DD-HH-MM-SS"</h3>
                            <input type="text" value={song.date_recorded} onChange={(e) => setSong({...song, date_recorded: e.target.value})}/>
                        </div>
                    }
                    { isid3Supported &&
                        <div className="properties_grid_item">
                            <h3>Edit Date released "YYYY-MM-DD-HH-MM-SS"</h3>
                            <input type="text" value={song.date_released} onChange={(e) => setSong({...song, date_released: e.target.value})}/>
                        </div>
                    }
                </div>
            </motion.div>
        </div>
    )
}

export default EditPropertiesModal