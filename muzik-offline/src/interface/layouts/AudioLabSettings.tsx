import { ChevronDown } from "@assets/icons";
import { DropDownMenuLarge } from "@components/index";
import { SavedObject } from "@database/saved_object";
import { selectedGeneralSettingEnum } from "@muziktypes/index";
import { useSavedObjectStore } from "@store/index";
import "@styles/layouts/AudioLabSettings.scss"; 
import { invoke } from "@tauri-apps/api/core";
import { stopSong } from "@utils/playerControl";
import { motion } from "framer-motion";
import { FunctionComponent, useEffect, useState } from "react";4

const settings_data: {
    key: number;
    title: string;
    dropDownName: selectedGeneralSettingEnum;
    options: string[]
}[] = [
    /*{
        key: 1,
        title: "Audio quality of music",
        dropDownName: selectedGeneralSettingEnum.AudioQuality,
        options: ["Lossless(24b/192kHz)", "Lossless(24b/48kHz)", "High(320kbps)", "Medium(192kbps)", "Low(128kbps)"]
    },*/
    {
        key: 2,
        title: "Playback speed of music",
        dropDownName: selectedGeneralSettingEnum.PlayBackSpeed,
        options: ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"]
    },
    {
        key: 3,
        title: "Seamless, fade-in/out audio transitions(will only apply on next song)",
        dropDownName: selectedGeneralSettingEnum.AudioTransition,
        options: ["Yes", "No"]
    }
]

type AudioLabSettingsProps = {
    openEqualiser: () => void;
}

const AudioLabSettings: FunctionComponent<AudioLabSettingsProps> = (_props: AudioLabSettingsProps) => {
    const [selectedGeneralSetting, setselectedGeneralSetting] = useState<selectedGeneralSettingEnum>(selectedGeneralSettingEnum.Nothing);
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const [currentOutputDevice, setOutputDevice] = useState<string>("default");
    const [outputDevices, setOutputDevices] = useState<string[]>([]);
    const [audioBackend, setAudioBackend] = useState<"rodio" | "kira">(local_store.player);

    function toggleDropDown(arg: selectedGeneralSettingEnum){
        if(arg === selectedGeneralSetting)setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        else setselectedGeneralSetting(arg);
    }

    async function setStoreValue(arg: string, type: string){
        let temp: SavedObject = local_store;
        temp[type as keyof SavedObject] = arg as never;
        setStore(temp);
        setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        if (type === selectedGeneralSettingEnum.PlayBackSpeed){
            await invoke("set_playback_speed", {player: local_store.player, speed: parseFloat(arg)});
        }
        if (type === selectedGeneralSettingEnum.OutputDevice){
            await invoke("set_output_device", {deviceName: arg});
            setOutputDevice(arg);
        }
    } 

    function changeAudioBackend(arg: "rodio" | "kira"){
        if(arg === local_store.player)return;
        setAudioBackend(arg);
        stopSong().then(() => {
            let temp: SavedObject = local_store;
            temp.player = arg;
            setStore(temp);
        }).catch((err) => {
            console.error(err);
            setAudioBackend(local_store.player);
        });
    }

    useEffect(() => {
        const setup = () => {
            if (local_store.OutputDevice === "") {
                invoke<string>("get_default_output_device").then((res) => {
                    setOutputDevice(res);
                });
            } else {
                setOutputDevice(local_store.OutputDevice);
            }

            invoke<string[]>("get_output_devices").then((res) => {
                setOutputDevices(res);
            });
        }

        setup();
    }, []);
    
    return (
        <div className="AudioLabSettings">
            <h2>Audio Lab Settings</h2>
            <div className="AudioLabSettings_container">
                <h5>Select your audio backend</h5>
                <motion.div className={"audio-backend" + (audioBackend === "rodio" ? " selected" : "")}
                    whileTap={{scale: 0.98}} onClick={() => changeAudioBackend("rodio")}>
                    <div className="logo">
                        <img src="https://avatars.githubusercontent.com/u/9999738?s=200&v=4" alt="Rodio logo" />
                    </div>
                    <h3>Rodio</h3>
                    <div className="details">
                        <div className="benefits">
                            <ul>
                                <li>More stable and faster</li>
                                <li>More developed specifically for audio playback</li>
                                <li>Supports output device switching</li>
                            </ul>
                        </div>
                        <div className="downsides">
                            <dl>
                                <dd>- No equaliser support</dd>
                                <dd>- No audio effects</dd>
                            </dl>
                        </div>
                    </div>
                </motion.div>
                <motion.div className={"audio-backend" + (audioBackend === "kira" ? " selected" : "")}
                    whileTap={{scale: 0.98}} onClick={() => changeAudioBackend("kira")}>
                    <div className="logo">
                        <img src="https://avatars.githubusercontent.com/u/2637802?v=4" alt="Kira logo" />
                    </div>
                    <h3>Kira</h3>
                    <div className="details">
                        <div className="benefits">
                            <ul>
                                <li>More developed specifically for game audio playback</li>
                                <li>Supports 3D spatial audio(coming soon)</li>
                                <li>Supports sound effects and equaliser(coming soon)</li>
                            </ul>
                        </div>
                        <div className="downsides">
                            <dl>
                                <dd>- Can be slow and unstable for large files</dd>
                                <dd>- No support for switching output device in app</dd>
                            </dl>
                        </div>
                    </div>
                </motion.div>
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
                    <h3>Output device</h3>
                    <div className="setting_dropdown">
                        { local_store.player === "rodio" ?
                            <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => toggleDropDown(selectedGeneralSettingEnum.OutputDevice)}>
                                <h4>{currentOutputDevice}</h4>
                                <motion.div className="chevron_icon" animate={{rotate: selectedGeneralSetting === selectedGeneralSettingEnum.OutputDevice ? 180 : 0}}>
                                    <ChevronDown />
                                </motion.div>
                            </motion.div>
                            :
                            <div className="setting_dropdown greyed_out">
                                <h4>default</h4>
                                <div className="chevron_icon">
                                    <ChevronDown />
                                </div>
                            </div>
                        }
                        <div className="DropDownMenu_container_last">
                            <DropDownMenuLarge
                                options={outputDevices} 
                                isOpen={selectedGeneralSetting === selectedGeneralSettingEnum.OutputDevice} 
                                type={selectedGeneralSettingEnum.OutputDevice}
                                selectOption={setStoreValue}
                            />
                        </div>
                    </div>
                </div>
                {/*<div className="setting">
                    <h3>Equaliser</h3>
                    <div className="setting_dropdown">
                        <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={props.openEqualiser}>
                            <h4>Open equaliser</h4>
                        </motion.div>
                    </div>
                </div>*/}
            </div>
        </div>
    )
}

export default AudioLabSettings