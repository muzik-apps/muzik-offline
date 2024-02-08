import { motion } from "framer-motion"
import { SavedObject } from "@database/index";
import "@styles/layouts/AppearanceSettings.scss"; 
import { ArrowRefresh, CancelRight } from "@assets/icons";
import { useSavedObjectStore, useWallpaperStore } from "@store/index";
import { OSTYPEenum } from "@muziktypes/index";

const accentColurs: string[] = ["saucy", "salmon", "violet","gloss", "lipstick", "lime", "grass",
    "sunny", "ubuntu", "blueberry", "sky", "midnight", "blinding"]

const opacityAmount: string[] = ["0", "2", "4", "6", "8", "10"]

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

    function SetOpacityAmount(arg: string){
        let temp: SavedObject = local_store;
        temp.WallpaperOpacityAmount = arg;
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

    function SetAnimations(arg: boolean){
        let temp: SavedObject = local_store;
        temp.Animations = arg;
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
                <h3>Wallpaper opacity amount</h3>
                <div className="opacity_amount">
                    {
                        opacityAmount.map((opacity, index) => 
                            <motion.div key={index} className={"button_select " + (local_store.WallpaperOpacityAmount === opacity ? "button_selected" : "")}
                                whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetOpacityAmount(opacity)}>
                                    {opacity}
                            </motion.div>
                        )
                    }
                </div>
                <h3>Accent color</h3>
                <div className="color_theme">
                    {
                        accentColurs.map((color, index) => 
                            <motion.div key={index} className={`button_select ${color} ` + (local_store.ThemeColour === color ? "button_selected" : "")}
                                whileHover={{scale: 1.03}} whileTap={{scale: 0.98}} onClick={() => SetThemeColour(color)}>
                                    {color}
                            </motion.div>
                        )
                    }
                </div>
                <h3>Player bar</h3>
                <div className="playerbar_select">
                    { local_store.OStype !== OSTYPEenum.Linux ?
                            <motion.div 
                                className={"button_select glass " + (local_store.PlayerBar ? "button_selected" : "")} 
                                whileHover={{scale: 1.03}} 
                                whileTap={{scale: 0.98}}
                                onClick={() => {SetPlayerBar(true)}}>
                                <h4>glass blur</h4>
                            </motion.div>
                        :
                            <motion.div 
                                className={"button_select black_linear " + (local_store.PlayerBar ? "button_selected" : "")} 
                                whileHover={{scale: 1.03}} 
                                whileTap={{scale: 0.98}}
                                onClick={() => {SetPlayerBar(true)}}>
                                <h4>dark cover</h4>
                            </motion.div>
                    }
                    <motion.div 
                        className={"button_select album_cover " + (!local_store.PlayerBar ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {SetPlayerBar(false)}}>
                            <h4>album cover blur</h4>
                    </motion.div>
                </div>
                <h3>Allow application wide animations</h3>
                <div className="animations_select">
                    <motion.div 
                        className={"button_select glass " + (!local_store.Animations ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}}
                        onClick={() => {SetAnimations(false)}}>
                        <h4>no animations</h4>
                        <CancelRight />
                    </motion.div>
                    <motion.div 
                        className={"button_select glass " + (local_store.Animations ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {SetAnimations(true)}}>
                            <h4>animate</h4>
                            <ArrowRefresh />
                    </motion.div>
                </div>
                <h3>App themed blur</h3>
                <div className="Themeblur_select">
                    { local_store.OStype !== OSTYPEenum.Linux ?
                        <motion.div 
                            className={"button_select glass " + (local_store.AppThemeBlur ? "button_selected" : "")} 
                            whileHover={{scale: 1.03}} 
                            whileTap={{scale: 0.98}}
                            onClick={() => {SetAppThemeBlur(true)}}>
                            <h4>glass blur</h4>
                        </motion.div>
                        :
                        <motion.div 
                            className="button_select not-clickable">
                            <h4>glass blur is not supported</h4>
                        </motion.div>
                    }
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