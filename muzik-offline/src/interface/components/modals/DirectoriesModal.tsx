import { FunctionComponent, useState } from "react";
import "@styles/components/modals/DirectoriesModal.scss";
import { invoke } from "@tauri-apps/api";
import { Song, toastType } from "types";
import { useDirStore, useSavedObjectStore, useToastStore } from "store";
import { createSongList_inDB, createAlbumsList_inDB, createGenresList_inDB, createArtistsList_inDB } from "utils";
import { isPermissionGranted, sendNotification } from '@tauri-apps/api/notification';

type DirectoriesModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

const DirectoriesModal: FunctionComponent<DirectoriesModalProps> = (props: DirectoriesModalProps) => {
    const { dir, setDir } = useDirStore((state) => { return { dir: state.dir, setDir: state.setDir}; });
    const [directories, setDirectories] = useState<string[]>(dir.Dir);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });

    function reloadSongs(){
        invoke("get_all_songs", { pathsAsJsonArray: JSON.stringify(directories), compressImageOption: local_store.CompressImage === "Yes" ? true : false })
            .then(async(res: any) => {
                const song_data: Song[] = JSON.parse(res);
                createSongList_inDB(song_data);
                createAlbumsList_inDB(song_data);
                createGenresList_inDB(song_data);
                createArtistsList_inDB(song_data);
                setToast({title: "Loading songs...", message: "Successfully loaded all the songs in the paths specified", type: toastType.success, timeout: 5000});

                const permissionGranted = await isPermissionGranted();
                if (permissionGranted) {
                    sendNotification({ title: 'Loading songs...', body: 'Successfully loaded all the songs in the paths specified' });
                }
            })
            .catch(async(_error) => {
                setToast({title: "Loading songs...", message: "Failed to load all the songs in the paths specified", type: toastType.error, timeout: 5000});
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
        setDirectories(val);
    }

    function areArraysDifferent(array1: string[], array2: string[]) {
        // Check if arrays have different lengths
        if (array1.length !== array2.length)return true;

        // Check if any item is not present in both arrays
        return array1.some(item => !array2.includes(item));
    }

    function closeModal(){
        if(areArraysDifferent(directories, dir.Dir)){
            setToast({title: "Loading songs...", message: "Please note that this process can take several minutes to complete depending on how many songs you have but you will be notified when it is done", type: toastType.warning, timeout: 10000});
            setDir({Dir: directories});
            reloadSongs();
        }
        props.closeModal();
    }
    
    return (
        <div className={"DirectoriesModal" + (props.isOpen ? " DirectoriesModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)closeModal()}}>
            <h2>type in directories as absolute paths, eg C:\songs\</h2>
            <textarea 
                className="modal"
                value={directories.join(",")}
                onChange={setDirectoriesVal}
                placeholder="directory 1, directory 2, etc
click anywhere to close the modal...">
            </textarea>
        </div>
    )
}

export default DirectoriesModal