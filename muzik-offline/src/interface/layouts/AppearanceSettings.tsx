import { motion } from "framer-motion"
import { SavedObject } from "@database/index";
import "@styles/layouts/AppearanceSettings.scss"; 
import { ArrowRefresh, CancelRight } from "@assets/icons";
import { useSavedObjectStore, useWallpaperStore } from "@store/index";
import { OSTYPEenum } from "@muziktypes/index";
import { FunctionComponent } from "react";
import { getThumbnailURL } from "@utils/index";

const accentColurs: string[] = ["saucy", "salmon", "violet","gloss", "lipstick", "lime", "grass",
    "sunny", "ubuntu", "blueberry", "sky", "midnight", "blinding"]

const opacityAmount: string[] = ["0", "2", "4", "6", "8", "10"]

type AppearanceSettingsProps = {
    openModal: () => void;
}

const AppearanceSettings: FunctionComponent<AppearanceSettingsProps> = (props: AppearanceSettingsProps) => {
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const { wallpaperUUID, unsetWallpaper } = useWallpaperStore((state) => { return { wallpaperUUID: state.wallpaperUUID, unsetWallpaper: state.unsetWallpaper }; });

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

    function setWallpaperBlurOrOpacity(arg: "blur" | "opacity"){
        let temp: SavedObject = local_store;
        temp.WallpaperBlurOrOpacity = arg;
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
            <h2>Appearance Settings</h2>
            <div className="AppearanceSettings_container">
                <h3>Background</h3>
                <div className="background_select">
                    <motion.div className={"button_select add_wallpaper " + (wallpaperUUID ? "button_selected" : "")} 
                    whileHover={{scale: 1.03}} 
                    whileTap={{scale: 0.98}}
                    onClick={() => { props.openModal() }}>
                        {wallpaperUUID ? <img src={getThumbnailURL(wallpaperUUID)} alt="thumbnail-image" /> : <>add/change wallpaper</>}
                    </motion.div>
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
                <h3>Wallpaper blur or gradient</h3>
                <div className="wallpaper_blur_or_gradient_select">
                    <motion.div 
                        className={"button_select glass " + (local_store.WallpaperBlurOrOpacity === "blur" ? "button_selected" : "")} 
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}}
                        onClick={() => {setWallpaperBlurOrOpacity("blur")}}>
                        <h4>blur</h4>
                    </motion.div>
                    <motion.div 
                        className={"button_select gradient " + (local_store.WallpaperBlurOrOpacity === "opacity" ? "button_selected" : "")}
                        whileHover={{scale: 1.03}} 
                        whileTap={{scale: 0.98}} 
                        onClick={() => {setWallpaperBlurOrOpacity("opacity")}}>
                            <h4>mask</h4>
                    </motion.div>
                </div>
                <h3>Wallpaper {local_store.WallpaperBlurOrOpacity === "blur" ? "blur" : "opacity"} amount</h3>
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