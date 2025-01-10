import { AlertTriangle, Spinner } from "@assets/icons";
import { modal_variants } from "@content/index";
import { toastType } from "@muziktypes/index";
import { useToastStore } from "@store/index";
import { invoke } from "@tauri-apps/api/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "@styles/components/modals/AudioWaveformInstallConsent.scss";

const AudioWaveformInstallConsent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    async function checkIfAudioWaveformIsInstalled(){
        invoke<boolean>("check_if_audio_waveform_is_installed").then((res) => {
            if(!res)setIsOpen(true);
        });
    }

    async function installAudioWaveform(){
        setToast({title: "Installing audio waveform", message: "This will only take a few seconds", type: toastType.info, timeout: 3000});
        setLoading(true);
        invoke("attempt_to_download_audio_waveform").then(() => {
            setToast({title: "Audio waveform installed", message: "You can now see the audio waveform of the songs you play", type: toastType.success, timeout: 5000});
            setLoading(false);
            setIsOpen(false);
        }).catch((err) => {
            setToast({title: "Failed to install audio waveform", message: err, type: toastType.error, timeout: 5000});
            setLoading(false);
        });
    }


    useEffect(() => {
        const consent = localStorage.getItem("audio_waveform_install_consent");
        if(consent === "false")return;
        // wait some time before checking if audio waveform is installed
        setTimeout(() => {
            checkIfAudioWaveformIsInstalled();
        }, 2000);
    }, [])
    
    return (
        <div className={"AudioWaveformInstallConsent" + (isOpen ? " AudioWaveformInstallConsent-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {if(e.target === e.currentTarget && !loading)setIsOpen(false)}}>
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
                            <motion.span whileTap={{scale: 0.98}} onClick={() => open("https://github.com/bbc/audiowaveform")}>
                                audiowaveform
                            </motion.span> 
                            not found!
                        </h3>
                        <p>With audiowaveform you can see the waveform of the songs you play and thus 
                            enhance your experience whilst using Muzik🎉. Would you like to thus install it📦?</p>
                        { !loading ?
                            <motion.div whileTap={{scale: 0.95}} className="install_button" onClick={installAudioWaveform}>
                                <h4>yes, install it!</h4>
                            </motion.div>
                            :
                            <div className="loading_install_button">
                                <h4>yes, install it!</h4>
                                <Spinner />
                            </div>
                        }
                        { !loading ?
                            <motion.div whileTap={{scale: 0.95}} className="cancel_button" onClick={() => {
                                setIsOpen(false);
                                localStorage.setItem("audio_waveform_install_consent", "false");
                            }}>
                                <h4>no, I don't want it</h4>
                            </motion.div>
                            :
                            <div className="loading_cancel_button">
                                <h4>no, I don't want it</h4>
                            </div>  
                        }
            </motion.div>
        </div>
    )
}

export default AudioWaveformInstallConsent