import { CheckboxComponent, RectangleSongBoxView } from "@components/index";
import { local_songs_db } from "@database/database";
import { Song } from "@muziktypes/index";
import { motion } from "framer-motion";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { ViewportList } from "react-viewport-list";
import "@styles/layouts/ExportSettings.scss";

type ExportSettingsProps = {
    openModal: (uuids: string[]) => void;
}

const ExportSettings: FunctionComponent<ExportSettingsProps> = (props: ExportSettingsProps) => {
    const [search, setSearch] = useState<string>("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const allSongsRef = useRef<any>(null);
    const listRef = useRef<any>(null);

    function captureSearch(e: React.ChangeEvent<HTMLInputElement>){
        setSearch(e.target.value);
        local_songs_db.songs.where("title").startsWithIgnoreCase(e.target.value).toArray().then((value) => setSongs(value));
    }

    /*function clearSearch(){
        setSearch("");
        local_songs_db.songs.toArray().then((value) => setSongs(value));
    }*/

    function exportSongs(){
        const uuids = songs.filter((value) => selected.has(value.id)).map((value) => value.uuid);
        props.openModal(uuids);
    }

    function configureSelectedState(){
        if(songs.length === selected.size){
            setSelected(new Set());
        } else {
            let temp: Set<number> = new Set();
            songs.forEach((value) => temp.add(value.id));
            setSelected(temp);
        }
    }

    useEffect(() => { local_songs_db.songs.toArray().then((value) => setSongs(value)); }, []);

    return (
        <div className="ExportSettings">
            <h2>Export Settings</h2>
            <div className="header">
                <input type="text" placeholder="Search for a song" value={search} onChange={captureSearch}/>
                <motion.div className="export_button" whileTap={{scale: 0.98}} onClick={exportSongs}>
                    <h3>Export</h3>
                </motion.div>
            </div>
            <div className="sub_heading">
                <CheckboxComponent isChecked={songs.length === 0 ? false: (songs.length === selected.size)} CheckToggle={configureSelectedState} />
                <h3>{selected.size} {selected.size === 1 ? "song is" : "songs are"} selected</h3>
            </div>
            <div className="ExportSettings_container" ref={allSongsRef}>
                <ViewportList viewportRef={allSongsRef} items={songs} ref={listRef}>
                    {
                        (song, index) => (
                            <RectangleSongBoxView 
                                key={index}
                                keyV={song.id}
                                songName={song.name}
                                artist={song.artist}
                                length={song.duration}
                                year={song.year}
                                cover={song.cover_uuid}
                                isChecked={selected.has(song.id)}
                                CheckToggle={() => 
                                    setSelected((prevSelected) => {
                                        const updatedSet = new Set(prevSelected); // Create a new Set
                                        if (updatedSet.has(song.id)) {
                                            updatedSet.delete(song.id); // Remove the song ID
                                        } else {
                                            updatedSet.add(song.id); // Add the song ID
                                        }
                                        return updatedSet; // Return the new Set
                                    })
                                }
                                />
                        )
                    }
                </ViewportList>
            </div>
        </div>
    )
}

export default ExportSettings
