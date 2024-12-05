import { motion } from "framer-motion";
import "@styles/layouts/GeneralSettings.scss";
import { SavedObject, viewableSideEl } from "@database/index";
import { ChevronDown, Disk, LayersThree, Menu, Microphone, MusicalNote } from "@icons/index";
import { OSTYPEenum, selectedGeneralSettingEnum, toastType } from "@muziktypes/index";
import { useState } from "react";
import { DropDownMenuLarge, RadioComponent } from "@components/index";
import { useSavedObjectStore, useViewableSideElStore, useToastStore } from "@store/index";
import { invoke } from "@tauri-apps/api/core";

const settings_data: {
    key: number;
    title: string;
    dropDownName: selectedGeneralSettingEnum;
    options: string[]
}[] = [
    {
        key: 1,
        title: "Open tab on App launch",
        dropDownName: selectedGeneralSettingEnum.LaunchTab,
        options: ["All tracks", "All artists", "All albums", "All genres", "All playlists"]
    },
    {
        key: 2,
        title: "Show app activity on discord(song you are currently listening to)",
        dropDownName: selectedGeneralSettingEnum.AppActivityDiscord,
        options: ["Yes", "No"]
    },
    {
        key: 3,
        title: "Volume step amount",
        dropDownName: selectedGeneralSettingEnum.VolumeStepAmount,
        options: ["1", "3", "5", "10", "15", "20"]
    },
    {
        key: 4,
        title: "Always rounded corners",
        dropDownName: selectedGeneralSettingEnum.AlwaysRoundedCornersWindows,
        options: ["Yes", "No"]
    }
]

const GeneralSettings = () => {
    const [selectedGeneralSetting, setselectedGeneralSetting] = useState<selectedGeneralSettingEnum>(selectedGeneralSettingEnum.Nothing);
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {viewableEl, setviewableEl } = useViewableSideElStore((state) => { return { viewableEl: state.viewableEl, setviewableEl: state.setviewableEl}; });
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    function toggleDropDown(arg: selectedGeneralSettingEnum){
        if(arg === selectedGeneralSetting)setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        else setselectedGeneralSetting(arg);
    }

    function setStoreValue(arg: string, type: string){
        if(type === "AppActivityDiscord" && arg === "Yes" && local_store.AppActivityDiscord === "No"){//connect
                handleDiscordConnectionChanges("Yes");
                invoke("allow_connection_and_connect_to_discord_rpc").then().catch(() => {
                    setToast({
                        title: "Discord connection...", 
                        message: "Failed to establish connection with discord", 
                        type: toastType.error, timeout: 5000
                    });
                    handleDiscordConnectionChanges("No");
                });
        } else if(type === "AppActivityDiscord" && arg === "No" && local_store.AppActivityDiscord === "Yes"){//disconnect
                handleDiscordConnectionChanges("No");
                invoke("disallow_connection_and_close_discord_rpc").then().catch(() => {
                    setToast({
                        title: "Discord connection...", 
                        message: "Failed to disconnect from discord", 
                        type: toastType.error, timeout: 5000
                    });
                    handleDiscordConnectionChanges("Yes");
                });
        } else{
            let temp: SavedObject = local_store;
            temp[type as keyof SavedObject] = arg as never;
            setStore(temp);
            setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        }
    }

    function handleDiscordConnectionChanges(arg: string){
        let temp: SavedObject = local_store;
        temp.AppActivityDiscord = arg;
        setStore(temp);
        setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
    }

    function setViewableEl(value: boolean, type: string){
        let temp: viewableSideEl = viewableEl;
        temp[type as keyof typeof viewableEl] = value;
        setviewableEl(temp);
    }

    return (
        <div className="General_settings">
            <h2>General settings</h2>
            <div className="Settings_container">
                {
                    settings_data.map((value) => 
                        value.dropDownName !== selectedGeneralSettingEnum.AlwaysRoundedCornersWindows ||
                        (value.dropDownName === selectedGeneralSettingEnum.AlwaysRoundedCornersWindows && (local_store.OStype === OSTYPEenum.Windows || local_store.OStype === OSTYPEenum.Linux)) ?
                        <div className="setting" key={value.key}>
                            <h3>{value.title}</h3>
                            <div className="setting_dropdown">
                                <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => toggleDropDown(value.dropDownName)}>
                                    <h4>{local_store[(value.dropDownName.toString() as keyof SavedObject)]}</h4>
                                    <motion.div className="chevron_icon" animate={{rotate: selectedGeneralSetting === value.dropDownName ? 180 : 0}}>
                                        <ChevronDown />
                                    </motion.div>
                                </motion.div>
                                <div className="DropDownMenu_container">
                                    <DropDownMenuLarge
                                        options={value.options} 
                                        isOpen={selectedGeneralSetting === value.dropDownName} 
                                        type={value.dropDownName}
                                        selectOption={setStoreValue}
                                    />
                                </div>
                            </div>
                        </div>
                        : 
                        null
                    )
                }
                <div className="setting">
                    <h3>Viewable side elements</h3>
                </div>
                <div className="my_library">
                    <h3>My library</h3>
                    <div className="radios">
                        <RadioComponent icon={MusicalNote} value={viewableEl.All_tracks} text="Tracks" type="All_tracks" setviewableEl={setViewableEl} />
                        <RadioComponent icon={Microphone} value={viewableEl.All_artists} text="Artists" type="All_artists" setviewableEl={setViewableEl} />
                        <RadioComponent icon={LayersThree} value={viewableEl.All_albums} text="Albums" type="All_albums" setviewableEl={setViewableEl} />
                        <RadioComponent icon={Disk} value={viewableEl.All_genres} text="Genres" type="All_genres" setviewableEl={setViewableEl} />
                        <RadioComponent icon={Menu} value={viewableEl.All_playlists} text="Playlists" type="All_playlists" setviewableEl={setViewableEl} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralSettings
