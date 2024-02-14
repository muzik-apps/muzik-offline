import { motion } from 'framer-motion';
import { FunctionComponent, useState, useEffect } from 'react';
import "@styles/pages/Settings.scss";
import { ChevronDown, ComponentIcon, InformationCircleContained, Layout, SettingsIcon } from "@icons/index";
import { DirectoriesModal, SettingsNavigator } from '@components/index';
import { selectedSettingENUM } from 'types';
import { AppearanceSettings, GeneralSettings, AdvancedSettings, AboutSettings } from '@layouts/index';
import { useSavedObjectStore } from 'store';

type SettingsProps = {
    openSettings: boolean;
    closeSettings: () => void;
}

const variants={
    open: {bottom: "-10vh"},
    closed: {bottom: "-110vh"},
}

const Settings: FunctionComponent<SettingsProps> = (props: SettingsProps) => {

    const [selectedSetting, setSelectedSetting] = useState<selectedSettingENUM>(selectedSettingENUM.General);
    const [CDisOpen, setCDModalState] = useState<boolean>(false);
    const {local_store,} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });

    function convertToEnum(arg: string){
        if(arg === selectedSettingENUM.General)return selectedSettingENUM.General;
        else if(arg === selectedSettingENUM.Appearance)return selectedSettingENUM.Appearance;
        else if(arg === selectedSettingENUM.Security)return selectedSettingENUM.Security;
        else if(arg === selectedSettingENUM.Advanced)return selectedSettingENUM.Advanced;
        else if(arg === selectedSettingENUM.About)return selectedSettingENUM.About;
        else return selectedSettingENUM.General;
    }

    function setSelectedSettingF(arg: string){setSelectedSetting(convertToEnum(arg));}
    
    useEffect(() => {
        if(!props.openSettings)setSelectedSetting(selectedSettingENUM.General);
    }, [props.openSettings])
    
    return (
        <>
            <motion.div className="settings_section"
                animate={props.openSettings ? "open" : "closed"}
                variants={variants}
                transition={!local_store.Animations ? {} : { type: "spring", stiffness: 100, damping: 14 }}
                >
                        <div className="settings_navigator">
                        <div className="title">
                            <motion.div whileTap={{scale: 0.98}} onClick={props.closeSettings}>
                                <ChevronDown />
                            </motion.div>
                            <h1>Settings</h1>
                        </div>
                        <SettingsNavigator icon={SettingsIcon} title={selectedSettingENUM.General} selected_setting={selectedSetting} setSelectedSettingF={setSelectedSettingF}/>
                        <SettingsNavigator icon={Layout} title={selectedSettingENUM.Appearance} selected_setting={selectedSetting} setSelectedSettingF={setSelectedSettingF}/>
                        {/*<SettingsNavigator icon={Lock} title={selectedSettingENUM.Security} selected_setting={selectedSetting} setSelectedSettingF={setSelectedSettingF}/>*/}
                        <SettingsNavigator icon={ComponentIcon} title={selectedSettingENUM.Advanced} selected_setting={selectedSetting} setSelectedSettingF={setSelectedSettingF}/>
                        <SettingsNavigator icon={InformationCircleContained} title={selectedSettingENUM.About} selected_setting={selectedSetting} setSelectedSettingF={setSelectedSettingF}/>
                        </div>
                        <div className="settings_panel">
                            {   props.openSettings &&
                                    (() => {
                                        switch(selectedSetting){
                                            case selectedSettingENUM.General:
                                                return <GeneralSettings openDirectoryModal={() => setCDModalState(true)}/>
                                            case selectedSettingENUM.Appearance:
                                                return <AppearanceSettings />
                                            //case selectedSettingENUM.Security:
                                            //    return <SecuritySettings />
                                            case selectedSettingENUM.Advanced:
                                                return <AdvancedSettings />
                                            case selectedSettingENUM.About:
                                                return <AboutSettings />
                                            default:
                                                return <GeneralSettings openDirectoryModal={() => setCDModalState(true)}/>
                                        }
                                    })()
                            }
                        </div>
            </motion.div>
            <DirectoriesModal isOpen={CDisOpen} closeModal={() => setCDModalState(false)}/>
        </>
    )
}

export default Settings
