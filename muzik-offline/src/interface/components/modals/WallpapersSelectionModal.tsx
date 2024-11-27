import { modal_variants } from "@content/index";
import { SavedObject } from "@database/saved_object";
import { useSavedObjectStore, useToastStore, useWallpaperStore } from "@store/index";
import { motion } from "framer-motion";
import { FunctionComponent, useEffect, useState } from "react";
import "@styles/components/modals/WallpapersSelectionModal.scss";
import { toastType, wallpaper } from "@muziktypes/index";
import { local_wallpapers_db } from "@database/database";
import { getThumbnailURL } from "@utils/index";
import { invoke } from "@tauri-apps/api/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { Trash } from "@assets/icons";

type WallpapersSelectionModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

const WallpapersSelectionModal: FunctionComponent<WallpapersSelectionModalProps> = (props: WallpapersSelectionModalProps) => {
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const { wallpaperUUID, setWallpaper } = useWallpaperStore((state) => { return { wallpaperUUID: state.wallpaperUUID, setWallpaper: state.setWallpaper, unsetWallpaper: state.unsetWallpaper }; });
    const [wallpapers, setWallpapers] = useState<wallpaper[]>([]);
    const [isloading, setIsLoading] = useState<boolean>(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const [hoveringWallpaper, setHoveringWallpaper] = useState<string | null>(null);

    function uploadImg(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files === null || e.target.files.length === 0)return;
        setIsLoading(true);
        setToast({title: "Processing image...", message: "Image is being processed now", type: toastType.info, timeout: 3000});
        const image = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            if(e.target?.result){
                const originalDataUrl = e.target.result as string;
                let toSend = "";
        
                if(originalDataUrl.startsWith("data:image/jpeg;base64,")){
                    //remove the header of the image
                    toSend = originalDataUrl.replace("data:image/jpeg;base64,", "");
                }
                else if (originalDataUrl.startsWith("data:image/png;base64,")){
                    //remove the header of the image
                    toSend = originalDataUrl.replace("data:image/png;base64,", "");
                }
                // Compress the image to a maximum size of 250x250
                if(toSend === ""){
                    setToast({title: "Processing error...", message: "Could not process this image, please try another image", type: toastType.error, timeout: 3000});
                    setIsLoading(false);
                    return;
                }

                invoke("add_new_wallpaper_to_db",{wallpaper: toSend})
                .then((uuid: any) => {
                    setToast({title: "Processing image...", message: "Your wallpaper has been loaded!", type: toastType.success, timeout: 3000});
                    setIsLoading(false);
                    local_wallpapers_db.wallpapers.add({
                        uuid: uuid,
                        key: undefined
                    })
                    setWallpapers([...wallpapers, {uuid: uuid, key: undefined}]);
                })
                .catch(() => {
                    setToast({title: "Internal Processing error...", message: "Could not process this image, please try another image", type: toastType.error, timeout: 3000});
                    setIsLoading(false);
                    return;
                });
            }
        };

        reader.readAsDataURL(image);
        let temp: SavedObject = local_store;
        temp.BGColour = "";
        setStore(temp);
    }

    async function fecthAllWallpapers(){
        local_wallpapers_db.wallpapers.toArray().then((data) => {
            setWallpapers(data);
        }); 
    }

    async function deleteWallpaper(uuid: string){
        await invoke("delete_thumbnail_and_wallpaper", {uuid});
        local_wallpapers_db.wallpapers.delete(uuid);
        setWallpapers(wallpapers.filter((wallpaper) => wallpaper.uuid !== uuid));
    }

    useEffect(() => { fecthAllWallpapers() }, []);

    return (
        <div className={"WallpapersSelectionModal" + (props.isOpen ? " WallpapersSelectionModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)props.closeModal();}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h2>Add or Choose a wallpaper</h2>

                <div className="wallpapers">
                    <motion.label className="wallpaper add_wallpaper " whileHover={{scale: 1.03}} whileTap={{scale: 0.98}}>
                            <input name="background-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
                            add wallpaper
                    </motion.label>
                    {wallpapers.map((wallpaper, index) => {
                        return (
                            <motion.div 
                            className={"wallpaper" + (wallpaperUUID === wallpaper.uuid ? " wallpaper_selected" : "")}
                            whileHover={{scale: 1.03}} 
                            whileTap={{scale: 0.98}} 
                            onHoverStart={() => {setHoveringWallpaper(wallpaper.uuid)}}
                            onHoverEnd={() => {setHoveringWallpaper(null)}}
                            key={index}>
                                <img src={getThumbnailURL(wallpaper.uuid)} alt="thumbnail-image" onClick={() => {
                                    setWallpaper(wallpaper.uuid);
                                    let temp: SavedObject = local_store;
                                    temp.BGColour = "";
                                    setStore(temp);
                                }} />
                                {
                                    hoveringWallpaper === wallpaper.uuid && wallpaperUUID !== wallpaper.uuid &&
                                    <motion.div className="delete-icon" onClick={() => deleteWallpaper(wallpaper.uuid)} whileTap={{scale: 0.98}} >
                                        <Trash />
                                    </motion.div>
                                }
                            </motion.div>
                        )
                    })}
                    {
                        isloading && 
                        <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" width={150} height={100} borderRadius={20}>
                            <Skeleton count={1} />
                        </SkeletonTheme>
                    }
                </div>

            </motion.div>
        </div>
    )
}

export default WallpapersSelectionModal