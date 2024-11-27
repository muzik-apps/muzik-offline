import { ChevronDown } from "@icons/index";
import { DropDownMenuLarge } from "@components/index";
import { SavedObject } from "@database/index";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSavedObjectStore, useToastStore } from "store";
import { selectedGeneralSettingEnum, toastType } from "@muziktypes/index";
import "@styles/layouts/AdvancedSettings.scss";
import { enable, disable } from '@tauri-apps/plugin-autostart';

const settings_data: {
    key: number;
    title: string;
    dropDownName: selectedGeneralSettingEnum;
    options: string[]
}[] = [
    {
        key: 1,
        title: "Compress song images(will only be compressed on subsequent directory scans)",
        dropDownName: selectedGeneralSettingEnum.CompressImage,
        options: ["Yes", "No"]
    },
    {
        key: 2,
        title: "Upcoming/History songs limit",
        dropDownName: selectedGeneralSettingEnum.UpcomingHistoryLimit,
        options: ["5", "10", "15", "20", "30", "50"]
    },
    {
        key: 3,
        title: "Left/right arrows seeking seconds amount",
        dropDownName: selectedGeneralSettingEnum.SeekStepAmount,
        options: ["5", "10", "15", "20", "30", "60"]
    },
    {
        key: 4,
        title: "Show song length or time until song ends",
        dropDownName: selectedGeneralSettingEnum.SongLengthORremaining,
        options: ["song length", "song ends"]
    },
    {
        key: 5,
        title: "Auto start app on system start",
        dropDownName: selectedGeneralSettingEnum.AutoStartApp,
        options: ["Yes", "No"]
    }
]

const AdvancedSettings = () => {
    const [selectedGeneralSetting, setselectedGeneralSetting] = useState<selectedGeneralSettingEnum>(selectedGeneralSettingEnum.Nothing);
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    function toggleDropDown(arg: selectedGeneralSettingEnum){
        if(arg === selectedGeneralSetting)setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        else setselectedGeneralSetting(arg);
    }

    function setStoreValue(arg: string, type: string){
        if (type === "AutoStartApp" && arg === "Yes" && local_store.AutoStartApp === "No") {
            setAutoStartApp("Yes");
            enable().then().catch(() => {
                setAutoStartApp("No");
                setToast({
                    title: "Auto start...", 
                    message: "Failed to set auto start on system start", 
                    type: toastType.error, timeout: 5000
                });
            });
        } else if (type === "AutoStartApp" && arg === "No" && local_store.AutoStartApp === "Yes") {
            setAutoStartApp("No");
            disable().then().catch(() => {
                setAutoStartApp("Yes");
                setToast({
                    title: "Auto start...", 
                    message: "Failed to set auto start on system start", 
                    type: toastType.error, timeout: 5000
                });
            });
        } else {
            let temp: SavedObject = local_store;
            temp[type as keyof SavedObject] = arg as never;
            setStore(temp);
            setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        }
    }

    function setAutoStartApp(arg: string) {
        let temp: SavedObject = local_store;
        temp.AutoStartApp = arg as never;
        setStore(temp);
        setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
    }
    
    return (
        <div className="AdvancedSettings">
            <h2>Advanced settings</h2>
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
                    <h3>Max folder depth to scan between 1 and 50(Note larger values will take longer)</h3>
                    <input type="number" value={local_store.DirectoryScanningDepth} onChange={(e) => {
                        // clamp the value to 1-50
                        if(e.target.value === "") e.target.value = "0";
                        else if(parseInt(e.target.value) < 1) e.target.value = "1";
                        else if(parseInt(e.target.value) > 50) e.target.value = "50";
                        else if(e.target.value.startsWith("0")) e.target.value = e.target.value.slice(1);
                        let temp: SavedObject = local_store;
                        temp.DirectoryScanningDepth = parseInt(e.target.value);
                        setStore(temp);
                    }}/>
                </div>
                {/*
                    <div className="setting">
                        <h3>Create a backup of your library(may take some time)</h3>
                        <div className="setting_dropdown">
                            <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => {}}>
                                <h4>Create backup</h4>
                            </motion.div>
                        </div>
                    </div>
                    <div className="setting">
                        <h3>Import library backup(may take some time)</h3>
                        <div className="setting_dropdown">
                            <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => {}}>
                                <h4>Import backup</h4>
                            </motion.div>
                        </div>
                    </div>
                */}
            </div>
        </div>
    )
}

export default AdvancedSettings