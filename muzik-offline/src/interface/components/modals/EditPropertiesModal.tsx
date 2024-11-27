import { FunctionComponent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Song, toastType } from "@muziktypes/index";
import "@styles/components/modals/EditPropertiesModal.scss";
import { invoke } from "@tauri-apps/api/core";
import { modal_variants } from "@content/index";
import { getCoverURL, getNullRandomCover } from "@utils/index";
import { useToastStore } from "@store/index";
import { local_songs_db } from "@database/database";
import {DateInput} from "@components/index";

type EditPropertiesModalProps = {
    songID: number;
    isOpen: boolean;
    closeModal: () => void;
}

const emptySong: Song = {
    id: 0,
    uuid: "",
    title: "",
    name: "",
    artist: "",
    album: "",
    genre: "",
    year: 0,
    duration: "",
    duration_seconds: 0,
    path: "",
    cover_uuid: null,
    date_recorded: "",
    date_released: "",
    file_size: 0,
    file_type: "",
    overall_bit_rate: 0,
    audio_bit_rate: 0,
    sample_rate: 0,
    bit_depth: 0,
    channels: 0
};

const EditPropertiesModal: FunctionComponent<EditPropertiesModalProps> = (props: EditPropertiesModalProps) => {

    const [song, setSong] = useState<Song>(emptySong);
    const [cover, setCover] = useState<string | null>(null);
    const [oldsong, setOldSong] = useState<Song>(emptySong);
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
            setCover(cover);
            setHasChangedCover(true);
        });
    }

    function saveChanges(){
        const song_v = song;
        props.closeModal();

        if(props.songID === -1) return;
        
        // check if any field has changed
        if(song_v.title === oldsong.title && song_v.artist === oldsong.artist 
            && song_v.album === oldsong.album && song_v.genre === oldsong.genre 
            && song_v.year === oldsong.year && song_v.date_recorded === oldsong.date_recorded
            && song_v.date_released === oldsong.date_released && cover === null){
                return;
        }

        invoke("edit_song_metadata", {songPath: song_v.path, songMetadata: JSON.stringify(song_v), hasChangedCover: hasChangedCover}).
        then(async(cover_uuid: any) => { 
            if(cover_uuid !== "Error acquiring cover uuid"){
                song_v.cover_uuid = cover_uuid;
            }
            await local_songs_db.songs.update(song_v.id, song_v);
            setToast({ title: "Editing song...", message: "Successfully updated metadata", type: toastType.success, timeout: 3000 });
        }).
        catch((e) => { setToast({ title: "Editing song...", message: e, type: toastType.error, timeout: 5000 }); });
    }

    useEffect(() => {
        if(props.songID === -1){
            setSong(emptySong);
            setOldSong(emptySong);
            return;
        }
        local_songs_db.songs.get(props.songID).then((oldSong) => {
            if(oldSong === undefined){
                setSong(emptySong);
                setOldSong(emptySong);
                return;
            }
            setISid3Supported(oldSong !== null && (oldSong.file_type === "mp3" || oldSong.file_type === "wav" || oldSong.file_type === "aiff") ? true : false);
            setSong(oldSong);
            setOldSong(oldSong);
        })
    }, [props.songID, props.isOpen])

    return (
        <div className={"EditPropertiesModal" + (props.isOpen ? " EditPropertiesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)props.closeModal();}}>
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
                                        cover !== null ? <img src={cover} alt="img" /> :
                                        song.cover_uuid === null ? <img src={getCoverURL(getNullRandomCover(song.id))} alt="song-cover" /> :
                                        <img src={getCoverURL(song.cover_uuid)} alt="img" />
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
                        <input type="text" id="input-field" value={song.title} onChange={(e) => setSong({...song, title: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Artist</h3>
                        <input type="text" id="input-field" value={song.artist} onChange={(e) => setSong({...song, artist: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Album</h3>
                        <input type="text" id="input-field" value={song.album} onChange={(e) => setSong({...song, album: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Genre</h3>
                        <input type="text" id="input-field" value={song.genre} onChange={(e) => setSong({...song, genre: e.target.value})}/>
                    </div>
                    <div className="properties_grid_item">
                        <h3>Edit Year</h3>
                        <input type="text" id="input-field" value={song.year} onChange={(e) => {
                            const reg = /^\d+$/;
                            if(!reg.test(e.target.value))return;
                            setSong({...song, year: Number.parseInt(e.target.value)});
                        }}/>
                    </div>
                    { isid3Supported && 
                        <div className="properties_grid_item">
                            <h3>Edit Date recorded "YYYY-MM-DD-HH-MM-SS"</h3>
                            <DateInput onChange={(date) => 
                                setSong({
                                    ...song, 
                                    date_recorded: date.getFullYear.toString() + "-" + 
                                    date.getMonth().toString() + "-" +
                                    date.getDate().toString() + "-" +
                                    date.getHours().toString() + "-" +
                                    date.getMinutes().toString() + "-" +
                                    date.getSeconds().toString()
                                })}/>
                        </div>
                    }
                    { isid3Supported &&
                        <div className="properties_grid_item">
                            <h3>Edit Date released "YYYY-MM-DD-HH-MM-SS"</h3>
                            <DateInput onChange={(date) => 
                                setSong({
                                    ...song, 
                                    date_released: date.getFullYear.toString() + "-" + 
                                    date.getMonth().toString() + "-" +
                                    date.getDate().toString() + "-" +
                                    date.getHours().toString() + "-" +
                                    date.getMinutes().toString() + "-" +
                                    date.getSeconds().toString()
                                })}/>
                        </div>
                    }
                    <motion.div className="save_button" whileTap={{scale: 0.98}} onClick={saveChanges}>
                        <h3>Save changes</h3>
                    </motion.div>
                    <motion.div className="cancel_button" whileTap={{scale: 0.98}} onClick={props.closeModal}>
                        <h3>Cancel</h3>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default EditPropertiesModal