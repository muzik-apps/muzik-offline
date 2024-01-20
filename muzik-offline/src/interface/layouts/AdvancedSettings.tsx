import { ChevronDown } from "@icons/index";
import { DropDownMenuLarge } from "@components/index";
import { SavedObject } from "@database/index";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSavedObjectStore } from "store";
import { selectedGeneralSettingEnum } from "@muziktypes/index";
import "@styles/layouts/AdvancedSettings.scss";

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
        options: ["5", "10", "15", "20"]
    },
    {
        key: 3,
        title: "Left/right arrows seeking seconds amount",
        dropDownName: selectedGeneralSettingEnum.SeekStepAmount,
        options: ["5", "10", "20", "40"]
    },
    {
        key: 4,
        title: "Show song length or time until song ends",
        dropDownName: selectedGeneralSettingEnum.SongLengthORremaining,
        options: ["song length", "time until song ends"]
    },
]

const AdvancedSettings = () => {
    const [selectedGeneralSetting, setselectedGeneralSetting] = useState<selectedGeneralSettingEnum>(selectedGeneralSettingEnum.Nothing);
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });

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
            </div>
        </div>
    )
}

export default AdvancedSettings