import { ChevronDown } from "@assets/icons";
import { DropDownMenuLarge, EqualizerSlider } from "@components/index";
import { selectedGeneralSettingEnum, AudioLabPreset, toastType } from "@muziktypes/index";
import { FlatAudioLab, useSavedObjectStore, useSavedPresetsValues, useToastStore } from "@store/index";
import "@styles/layouts/AudioLabSettings.scss"; 
import { motion } from "framer-motion";
import { useState } from "react";

const AudioLabSettings = () => {
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {map, addValues} = useSavedPresetsValues((state) => {return { map: state.map, addValues: state.addValue}; });
    const [AudioLabPreset, setAudioLabPreset] = useState<string>(local_store.AudioLabPreset);
    const [AudioLab, setAudioLab] = useState<AudioLabPreset>(map.get(local_store.AudioLabPreset) ?? FlatAudioLab);
    const [selectedGeneralSetting, setselectedGeneralSetting] = useState<selectedGeneralSettingEnum>(selectedGeneralSettingEnum.Nothing);
    
    function toggleDropDown(){
        if(selectedGeneralSetting === selectedGeneralSettingEnum.AudioLabPreset)
            setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
        else setselectedGeneralSetting(selectedGeneralSettingEnum.AudioLabPreset);
    }

    function setStoreValue(arg: string){
        let temp = local_store;
        temp.AudioLabPreset = arg;
        setAudioLab(map.get(temp.AudioLabPreset) ?? FlatAudioLab);
        setAudioLabPreset(temp.AudioLabPreset);
        setStore(temp);
        setselectedGeneralSetting(selectedGeneralSettingEnum.Nothing);
    }

    function createNewPreset(){
        if(map.has(AudioLabPreset)){
            setToast({title: "Preset creation", message: "A preset with that name already exists", type: toastType.error, timeout: 3000});
        }
        else {
            addValues(AudioLabPreset, AudioLab);
            let temp = local_store;
            temp.AudioLabPreset = AudioLabPreset;
            temp.SavedPresets.push(AudioLabPreset);
            setStore(temp);
        }
    }

    function resetPresetName(){setAudioLabPreset("");}

    return (
        <div className="AudioLabSettings">
            <h2>Audio Lab</h2>
            <div className="AudioLabSettings_container">
                <div className="setting">
                    <h3>Select a preset</h3>
                    <div className="setting_dropdown">
                        <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={toggleDropDown}>
                            <h4>{local_store.AudioLabPreset}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: selectedGeneralSetting === selectedGeneralSettingEnum.AudioLabPreset ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuLarge
                                options={local_store.SavedPresets} 
                                isOpen={selectedGeneralSetting === selectedGeneralSettingEnum.AudioLabPreset} 
                                type={selectedGeneralSettingEnum.AudioLabPreset}
                                selectOption={setStoreValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="setting">
                    <h3>Select a preset</h3>
                    <div className="setting_dropdown">
                        <input type="text" placeholder="Type here to set preset name"
                            value={AudioLabPreset} onChange={(e) => setAudioLabPreset(e.target.value)}/>
                        <motion.div className="setting_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={createNewPreset}>
                            <h4>create a new preset</h4>
                        </motion.div>
                    </div>
                </div>
                <div className="equalizer_container">
                    <div className="decibel_labels">
                        { ["12dB", "6dB", "0dB", "-6dB", "-12dB"].map((value) => <div key={value} className="decibel_level">{value}</div>) }
                    </div>
                    <div className="equalizer_border">
                        <div className="equalizer">
                            <EqualizerSlider frequency={"62Hz"} value={AudioLab.SixtyTwoHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, SixtyTwoHz: value })}}/>
                            <EqualizerSlider frequency={"125Hz"} value={AudioLab.OneTwentyFiveHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, OneTwentyFiveHz: value })}}/>
                            <EqualizerSlider frequency={"250Hz"} value={AudioLab.TwoFiftyHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, TwoFiftyHz: value })}}/>
                            <EqualizerSlider frequency={"500Hz"} value={AudioLab.FiveHundredHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, FiveHundredHz: value })}}/>
                            <EqualizerSlider frequency={"1kHz"} value={AudioLab.OnekHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, OnekHz: value })}}/>
                            <EqualizerSlider frequency={"2kHz"} value={AudioLab.TwokHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, TwokHz: value })}}/>
                            <EqualizerSlider frequency={"4kHz"} value={AudioLab.FourkHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, FourkHz: value })}}/>
                            <EqualizerSlider frequency={"8kHz"} value={AudioLab.EightkHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, EightkHz: value })}}/>
                            <EqualizerSlider frequency={"16kHz"} value={AudioLab.SixteenkHz} 
                                updateValue={(value) => {resetPresetName(); setAudioLab({ ... AudioLab, SixteenkHz: value })}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AudioLabSettings