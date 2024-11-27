import { FunctionComponent, useState } from "react";
import "@styles/components/modals/DirectoriesModal.scss";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';
import { appConfigDir } from '@tauri-apps/api/path';
import { toastType } from "@muziktypes/index";
import { useDirStore, useSavedObjectStore, useToastStore } from "store";
import { isPermissionGranted, sendNotification } from '@tauri-apps/plugin-notification';
import { motion } from "framer-motion";
import { fetch_library } from "utils";
import { local_albums_db, local_artists_db, local_genres_db, local_songs_db } from "@database/database";
import { modal_variants } from "@content/index";

type DirectoriesModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

/**
 * @deprecated This component is deprecated and will be removed in future releases.
 * Directory control has been shifted to an entirely seperate page as it is easier for the user to 
 * control it that way. Please have a look at `MusicFoldersSettings` to see the new organisation.
 */
const DirectoriesModal: FunctionComponent<DirectoriesModalProps> = (props: DirectoriesModalProps) => {
    const { dir, setDir } = useDirStore((state) => { return { dir: state.dir, setDir: state.setDir}; });
    const [directories, setDirectories] = useState<Set<string>>(dir.Dir);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });

    async function reloadSongs(){
        await local_songs_db.songs.clear();
        await local_albums_db.albums.clear();
        await local_artists_db.artists.clear();
        await local_genres_db.genres.clear();

        invoke("get_all_songs", { pathsAsJsonArray: JSON.stringify(directories), compressImageOption: local_store.CompressImage === "Yes" ? true : false })
            .then(async() => {
                const res = await fetch_library(true);
                let message = "";

                if(res.status === "error")message = res.message;
                else message = "Successfully loaded all the songs in the paths specified. You may need to reload the page you are on to see your new songs";

                setToast({title: "Loading songs...", message: message, type: toastType.success, timeout: 5000});

                const permissionGranted = await isPermissionGranted();
                if(permissionGranted)sendNotification({ title: 'Loading songs...', body: message });
            })
            .catch(async(_error) => {
                console.log(_error);
                setToast({title: "Loading songs...", message: "Please note that this process can take several minutes to complete depending on how many songs you have but you will be notified when it is done", type: toastType.info, timeout: 10000});
                const permissionGranted = await isPermissionGranted();
                if (permissionGranted) {
                    sendNotification({ title: 'Loading songs...', body: 'Failed to load all the songs in the paths specified' });
                }
            });
    }

    function setDirectoriesVal(e: React.ChangeEvent<HTMLTextAreaElement>){
        const val: string[] = e.target.value.split(/\s*,\s*/).map(function(item) {
            return item.replace(/\n$/, ''); // Removes trailing newline character
        });
        //remove duplicates from array
        const unique = new Set(val);
        setDirectories(unique);
    }

    function areArraysDifferent(array1: string[], array2: string[]) {
        // Check if arrays have different lengths
        if (array1.length !== array2.length)return true;

        // Check if any item is not present in both arrays
        return array1.some(item => !array2.includes(item));
    }

    function closeModal(){
        if(areArraysDifferent(Array.from(directories), Array.from(dir.Dir))){
            setToast({title: "Loading songs...", message: "Please note that this process can take several minutes to complete depending on how many songs you have but you will be notified when it is done", type: toastType.warning, timeout: 10000});
            setDir({Dir: directories});
            reloadSongs();
        }
        props.closeModal();
    }

    async function openFileDialog(){
        const selected = await open({
            directory: true,
            multiple: false,
            defaultPath: await appConfigDir(),
        });
        if(Array.isArray(selected)){
            //this is not valid since multiple cannot be selected
        } 
        else if(selected === null){
            // user cancelled the selection so return
        } 
        else{
            //if directory is not contained already add the selected directory to setDirectories array
            if(!directories.has(selected))setDirectories(new Set(directories).add(selected));
        }
    };

    async function refreshLibrary(){
        setToast({title: "refresh library...", message: "You will be notified when the refresh is done", type: toastType.info, timeout: 2000});

        await local_songs_db.songs.clear();
        await local_albums_db.albums.clear();
        await local_artists_db.artists.clear();
        await local_genres_db.genres.clear();

        const res = await fetch_library(true);
        let message = "";

        if(res.status === "error")message = res.message;
        else message = "Successfully refreshed your library";

        setToast({title: "Refresh library...", message: message, type: res.status === "error" ? toastType.error : toastType.success, timeout: 5000});
        const permissionGranted = await isPermissionGranted();
        if(permissionGranted)sendNotification({ title: 'Refresh library...', body: message });
    }

    function clearDirectories(){ setDirectories(new Set()); }
    
    return (
        <div className={"DirectoriesModal" + (props.isOpen ? " DirectoriesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)closeModal()}}>
            <h2>type in directories as absolute paths, eg C:\songs\. click anywhere to close</h2>
            <motion.textarea 
                animate={props.isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="modal"
                value={directories.size > 0 ? Array.from(directories).join(", ") : ""}
                onChange={setDirectoriesVal}
                placeholder="directory 1, directory 2, etc">
            </motion.textarea>
            <h2>clear directories, refresh your library or select a new directory</h2>
            <div className="action_buttons">
                <motion.div className="clear_directories" whileTap={{scale: 0.98}} onClick={clearDirectories}>
                    <h3>clear all directories</h3>
                </motion.div>
                <motion.div className="refresh_libraries" whileTap={{scale: 0.98}} onClick={refreshLibrary}>
                    <h3>refresh library</h3>
                </motion.div>
                <motion.div className="select_directory" whileTap={{scale: 0.98}} onClick={openFileDialog}>
                    <h3>Select a directory</h3>
                </motion.div>
            </div>
        </div>
    )
}

export default DirectoriesModal
