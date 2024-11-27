import { useDirStore, useSavedObjectStore, useToastStore } from "@store/index";
import "@styles/layouts/MusicFoldersSettings.scss"; 
import { motion } from "framer-motion";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { open } from '@tauri-apps/plugin-dialog';
import { appConfigDir } from '@tauri-apps/api/path';
import { Cross } from "@assets/icons";
import { local_songs_db, local_albums_db, local_artists_db, local_genres_db } from "@database/database";
import { toastType } from "@muziktypes/index";
import { invoke } from "@tauri-apps/api/core";
import { isPermissionGranted, sendNotification } from "@tauri-apps/plugin-notification";
import { areArraysDifferent, fetch_library } from "@utils/index";

type MusicFoldersSettingsProps = {
    openConfirmModal: (path: string) => void;
}

const MusicFoldersSettings: FunctionComponent<MusicFoldersSettingsProps> = (props: MusicFoldersSettingsProps) => {
    const { dir, setDir } = useDirStore((state) => { return { dir: state.dir, setDir: state.setDir}; });
    const oldDirRef = useRef<Set<string> | undefined>(undefined);
    const [currentDir, setCurrentDir] = useState<Set<string>>(dir.Dir);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });
    const [directory, setDirectory] = useState<string>("");

    function reloadSongs(){
        invoke("get_all_songs", { 
            pathsAsJsonArray: JSON.stringify(Array.from(currentDir)), 
            compressImageOption: local_store.CompressImage === "Yes" ? true : false,
            maxDepth: local_store.DirectoryScanningDepth
        })
        .then(async() => {
                setDir({Dir: currentDir});
                await local_songs_db.songs.clear();
                await local_albums_db.albums.clear();
                await local_artists_db.artists.clear();
                await local_genres_db.genres.clear();
                const res = await fetch_library(true);
                let message = "";

                if(res.status === "error")message = res.message;
                else message = "Successfully loaded all the songs in the paths specified. You may need to reload the page you are on to see your new songs";

                setToast({title: "Loading songs...", message: message, type: toastType.success, timeout: 5000});

                const permissionGranted = await isPermissionGranted();
                if(permissionGranted)sendNotification({ title: 'Loading songs...', body: message });
            })
            .catch(async(_error) => {
                if(currentDir.size === 0){
                    setToast({title: "Loading songs...", message: "No directories specified", type: toastType.info, timeout: 5000});
                    await local_songs_db.songs.clear();
                    await local_albums_db.albums.clear();
                    await local_artists_db.artists.clear();
                    await local_genres_db.genres.clear();
                    const permissionGranted = await isPermissionGranted();
                if(permissionGranted)sendNotification({ title: 'Loading songs...', body: 'No directories specified' });
                    return;
                }

                console.log(_error);
                setDir({Dir: oldDirRef.current ?? new Set()});
                setToast({title: "Loading songs...", message: "Failed to load all the songs in the paths specified", type: toastType.error, timeout: 5000});
                const permissionGranted = await isPermissionGranted();
                if (permissionGranted) {
                    sendNotification({ title: 'Loading songs...', body: 'Failed to load all the songs in the paths specified' });
                }
            });
    }

    async function openFileDialog(){
        const selected = await open({
            directory: true,
            multiple: false,
            defaultPath: await appConfigDir(),
        });
        if(selected){
            const newDir = new Set(currentDir);
            newDir.add(selected);
            setCurrentDir(newDir);
        }
    };

    function addNewDir(){
        if(directory === "")return;
        const newDir = new Set(currentDir);
        newDir.add(directory);
        setCurrentDir(newDir);
        setDirectory("");
    }

    useEffect(() => {
        // on component mount
        if(oldDirRef.current === undefined){ oldDirRef.current = new Set(dir.Dir); }
        // when component unmounts
        return () => {
            //console.log(Array.from(oldDirRef.current ?? new Set), Array.from(currentDir));
            if(areArraysDifferent(Array.from(oldDirRef.current ?? new Set), Array.from(currentDir))){
                setToast({title: "Loading songs...", message: "We are searching for new songs", type: toastType.warning, timeout: 5000});
                reloadSongs();
            }
        }
    }, [currentDir]);

    useEffect(() => {
        // listen for changes in the dir
        setCurrentDir(dir.Dir);
    }, [dir.Dir]);
    
    return (
        <div className="MusicFoldersSettings">
            <h2>Music Folder Settings</h2>
            <div className="header">
                <input type="text" placeholder="Type a folder path" value={directory} onChange={(e) => setDirectory(e.target.value)}/>
                <div className="buttons">
                    <motion.div className="add_directory" whileTap={{scale: 0.98}} onClick={addNewDir}>
                        <h3>Add directory</h3>
                    </motion.div>
                    <motion.div className="select_directory" whileTap={{scale: 0.98}} onClick={openFileDialog}>
                        <h3>Select a directory</h3>
                    </motion.div>
                </div>
            </div>
            <div className="MusicFoldersSettings_container">
                {
                    Array.from(currentDir).map((value, index) => 
                        <div className="path" key={index}>
                            <h3>{value}</h3>
                            <div className="icon" onClick={() => props.openConfirmModal(value)}>
                                <Cross/>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MusicFoldersSettings