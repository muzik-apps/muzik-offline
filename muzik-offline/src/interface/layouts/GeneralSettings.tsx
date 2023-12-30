import { motion } from "framer-motion";
import "@styles/layouts/GeneralSettings.scss";
import { SavedObject, viewableSideEl } from "@database/index";
import { ChevronDown, Disk, LayersThree, Menu, Microphone, MusicalNote } from "@assets/icons";
import { selectedGeneralSettingEnum } from "types";
import { FunctionComponent, useState } from "react";
import { DropDownMenuLarge, RadioComponent } from "@components/index";
import { useSavedObjectStore, useViewableSideElStore } from "store";

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
        options: ["Home page", "Artists", "Charts", "All tracks", "All artists", "All albums", "All genres", "All playlists"]
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
    }
]

type GeneralSettingsProps = {
    openDirectoryModal: () => void;
}

const GeneralSettings: FunctionComponent<GeneralSettingsProps> = (props: GeneralSettingsProps) => {
    const [selectedGeneralSetting, setselectedGeneralSetting] = useState<selectedGeneralSettingEnum>(selectedGeneralSettingEnum.Nothing);
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {viewableEl, setviewableEl } = useViewableSideElStore((state) => { return { viewableEl: state.viewableEl, setviewableEl: state.setviewableEl}; });

    function toggleDropDown(arg: selectedGeneralSettingEnum){
        if(arg === selectedGeneralSetting)setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        else setselectedGeneralSetting(arg);
    }

    function setStoreValue(arg: string, type: string){
        let temp: SavedObject = local_store;
        temp[type as keyof SavedObject] = arg as never;
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
                    </div>)
                }
                <div className="setting">
                    <h3>Directories</h3>
                    <div className="directories_container">
                        <motion.h4 whileTap={{scale: 0.98}} onClick={props.openDirectoryModal}>click here to change directories</motion.h4>
                    </div>
                </div>
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