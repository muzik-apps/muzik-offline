import { AlertTriangle } from "@assets/icons";
import { modal_variants } from "@content/index";
import { toastType } from "@muziktypes/index";
import { useToastStore } from "@store/index";
import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "@styles/components/modals/AudioWaveformInstallConsent.scss";

const AudioWaveformInstallConsent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    async function checkIfAudioWaveformIsInstalled(){
        invoke<boolean>("check_if_audio_waveform_is_installed").then((res) => {
            if(!res)setIsOpen(true);
        });
    }

    async function installAudioWaveform(){
        setToast({title: "Installing audio waveform", message: "This will only take a few seconds", type: toastType.info, timeout: 3000});
        invoke("attempt_to_download_audio_waveform").then(() => {
            setToast({title: "Audio waveform installed", message: "You can now see the audio waveform of the songs you play", type: toastType.success, timeout: 5000});
            setIsOpen(false);
        }).catch(() => {
            setToast({title: "Failed to install audio waveform", message: "Please try again later", type: toastType.error, timeout: 5000});
            setIsOpen(false);
        });
    }


    useEffect(() => {
        checkIfAudioWaveformIsInstalled();
    }, [])
    return (
        <div className={"AudioWaveformInstallConsent" + (isOpen ? " AudioWaveformInstallConsent-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget)setIsOpen(false)}}>
            <motion.div 
                animate={isOpen ? "open" : "closed"}
                variants={modal_variants}
                className="confirm_install_modal">
                        <div className="covers">
                            <div className="first_cover "/>
                            <div className="second_cover">
                                <AlertTriangle />
                            </div>
                        </div>
                        <h3>
                            We noticed you don't have 
                                <motion.span whileTap={{scale: 0.98}} onClick={() => open("https://github.com/bbc/audiowaveform")}>
                                    audiowaveform
                                </motion.span> 
                            installed, would you like to install it?
                        </h3>
                        <p>With audiowaveform you can see the waveform of the songs you play and thus enhance your experience whilst using Muzik🎉</p>
                        <motion.div whileTap={{scale: 0.95}} className="install_button" onClick={installAudioWaveform}>
                            <h4>yes, install it!</h4>
                        </motion.div>
                        <motion.div whileTap={{scale: 0.95}} className="cancel_button" onClick={() => setIsOpen(false)}>
                            <h4>no, I don't want it</h4>
                        </motion.div>
            </motion.div>
        </div>
    )
}

export default AudioWaveformInstallConsent