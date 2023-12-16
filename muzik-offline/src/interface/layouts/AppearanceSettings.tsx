import { motion } from "framer-motion"
import { SavedObject } from "@database/index";
import "@styles/layouts/AppearanceSettings.scss"; 
import { ArrowRefresh, CancelRight } from "@assets/icons";
import { useSavedObjectStore, useWallpaperStore } from "store";

const AppearanceSettings = () => {
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const { wallpaper, setWallpaper, unsetWallpaper } = useWallpaperStore((state) => { return { wallpaper: state.wallpaper, setWallpaper: state.setWallpaper, unsetWallpaper: state.unsetWallpaper }; });

    function uploadImg(e: any){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        
        reader.addEventListener('load', () => setWallpaper({DisplayWallpaper: reader.result}));
        let temp: SavedObject = local_store;
        temp.BGColour = "";
        setStore(temp);
    }

    function changeToBgCCOL(obj: string){
        let temp: SavedObject = local_store;
        temp.BGColour = obj;
        setStore(temp);
        unsetWallpaper();
    }

    function SetThemeColour(arg: string){
        let temp: SavedObject = local_store;
        temp.ThemeColour = arg;
        setStore(temp);
    }

    function SetPlayerBar(arg: boolean){
        let temp: SavedObject = local_store;
        temp.PlayerBar = arg;
        setStore(temp);
    }

    function SetAppThemeBlur(arg: boolean){
        let temp: SavedObject = local_store;
        temp.AppThemeBlur = arg;
        setStore(temp);
    }

    function SetBackgroundAnimation(arg: boolean){
        let temp: SavedObject = local_store;
        temp.AnimateBackground = arg;
        setStore(temp);
    }

    return (
        <div className="AppearanceSettings">
            <h2>Appearance</h2>
            <div className="AppearanceSettings_container">
                <h3>Background</h3>
                <div className="background_select">
                    <motion.label className={"button_select add_wallpaper " + (wallpaper && wallpaper.DisplayWallpaper ? "button_selected" : "")} whileHover={{scale: 1.03}} whileTap={{scale: 0.98}}>
                        <input name="background-img" type="file" accept="image/png, image/jpeg" onChange={uploadImg}/>
                        add wallpaper
                    </motion.label>
                    <motion.div 
                        className={"button_select black_linear " + (local_store.BGColour === "black_linear" ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {changeToBgCCOL("black_linear")}}>
                            <h4>dark background</h4>
                    </motion.div>
                    <motion.div 
                        className={"button_select pink_blue_gradient " + (local_store.BGColour === "pink_blue_gradient" ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {changeToBgCCOL("pink_blue_gradient")}}>
                            <h4>pink-blue gradient</h4>
                    </motion.div>
                    <motion.div 
                        className={"button_select blue_purple_gradient " + (local_store.BGColour === "blue_purple_gradient" ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {changeToBgCCOL("blue_purple_gradient")}}>
                            <h4>blue-purple gradient</h4>
                    </motion.div>
                </div>
                <h3>Color theme</h3>
                <div className="color_theme">
                    <motion.div className={"button_select saucy " + (local_store.ThemeColour === "saucy" ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("saucy")}/>
                    <motion.div className={"button_select salmon " + (local_store.ThemeColour === "salmon" ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("salmon")}/>
                    <motion.div className={"button_select violet " + (local_store.ThemeColour === "violet" ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("violet")}/>
                    <motion.div className={"button_select lime " + (local_store.ThemeColour === "lime" ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("lime")}/>
                    <motion.div className={"button_select sunny " + (local_store.ThemeColour === "sunny" ? "button_selected" : "")}  
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("sunny")}/>
                    <motion.div className={"button_select ubuntu " + (local_store.ThemeColour === "ubuntu" ? "button_selected" : "")}  
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("ubuntu")}/>
                    <motion.div className={"button_select blueberry " + (local_store.ThemeColour === "blueberry" ? "button_selected" : "")}  
                        whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour("blueberry")}/>
                </div>
                <h3>Player bar</h3>
                <div className="playerbar_select">
                    <motion.div 
                        className={"button_select glass " + (local_store.PlayerBar ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}}
                        onClick={() => {SetPlayerBar(true)}}>
                        <h4>glass blur</h4>
                    </motion.div>
                    <motion.div 
                        className={"button_select album_cover " + (!local_store.PlayerBar ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {SetPlayerBar(false)}}>
                            <h4>album cover blur</h4>
                    </motion.div>
                </div>
                <h3>Full screen player animations</h3>
                <div className="animations_select">
                    <motion.div 
                        className={"button_select glass " + (!local_store.AnimateBackground ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}}
                        onClick={() => {SetBackgroundAnimation(false)}}>
                        <h4>no animations</h4>
                        <CancelRight />
                    </motion.div>
                    <motion.div 
                        className={"button_select glass " + (local_store.AnimateBackground ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {SetBackgroundAnimation(true)}}>
                            <h4>animate</h4>
                            <ArrowRefresh />
                    </motion.div>
                </div>
                <h3>App themed blur</h3>
                <div className="Themeblur_select">
                    <motion.div 
                        className={"button_select glass " + (local_store.AppThemeBlur ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}}
                        onClick={() => {SetAppThemeBlur(true)}}>
                        <h4>glass blur</h4>
                    </motion.div>
                    <motion.div 
                        className={"button_select black_linear " + (!local_store.AppThemeBlur ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {SetAppThemeBlur(false)}}>
                            <h4>no blur</h4>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default AppearanceSettings