import { modal_variants } from "@content/index";
import "@styles/components/modals/AirplayCastModal.scss";
import { motion } from "framer-motion";
import { useState } from "react";

type AirplayCastModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

const AirplayCastModal = (props: AirplayCastModalProps) => {

    const [chromecast_devices, _setChromecastDevices] = useState<string[]>([]);
    const [airplay_devices, _setAirplayDevices] = useState<string[]>([]);

    function scan(){
        //scan for chromecast devices
        //scan for airplay devices
    }

    return (
        <div className={"AirplayCastModal" + (props.isOpen ? " AirplayCastModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h2>Chromecast devices</h2>
                <div className="devices-list">
                    {chromecast_devices.length === 0 && (<h3>No chromecast devices found</h3>)}
                    {chromecast_devices.map(device => 
                        <motion.div className="device-container" whileTap={{scale: 0.98}}><h3>{device}</h3></motion.div>)}
                </div>
                <h2>Airplay devices</h2>
                <div className="devices-list">
                    {airplay_devices.length === 0 && (<h3>No airplay devices found</h3>)}
                    {airplay_devices.map(device => 
                        <motion.div className="device-container" whileTap={{scale: 0.98}}><h3>{device}</h3></motion.div>)}
                </div>
                <motion.div className="scan_button" whileTap={{scale: 0.98}} onClick={scan}>
                    <h3>Scan for devices</h3>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default AirplayCastModal