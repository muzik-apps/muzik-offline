import { modal_variants } from "@content/index";
import "@styles/components/modals/AirplayCastModal.scss";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AirplayPinModal from "./AirplayPinModal";
import { Check, Computer, Headphones, Laptop, Speaker, TV, WifiLoader } from "@assets/icons";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useAirplayDevicesMap, useChromecastDevicesMap, useToastStore } from "@store/index";
import { toastType, AirplayCastDevice, AirplayCastResponse } from "@muziktypes/index";
import { invoke } from "@tauri-apps/api/core";

type AirplayCastModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

const AirplayCastModal = (props: AirplayCastModalProps) => {
    const {chromecast_devices, setChromecastDevices} = useAirplayDevicesMap((state) => { return {chromecast_devices: state.devices, setChromecastDevices: state.setDevices}; });
    const {airplay_devices, setAirplayDevices} = useChromecastDevicesMap((state) => { return {airplay_devices: state.devices, setAirplayDevices: state.setDevices}; });
    const [selectedAirplayDevice, setSelectedAirplayDevice] = useState<AirplayCastDevice | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    async function scan(){
        setIsScanning(true);
        try{
            // incoming format is {"status": "success", "message": "any message", "data": [{"id", "name", "address", "model"}]}
            const airplay_api_res: any = await invoke("airplay_scan");
            const chromecast_api_res: any = await invoke("chromecast_scan");

            const airplay_res: AirplayCastResponse = JSON.parse(airplay_api_res);
            console.log(airplay_res);
            const chromecast_res: AirplayCastResponse = JSON.parse(chromecast_api_res);
            console.log(chromecast_res);
            if(airplay_res.status === "success" && chromecast_res.status === "success"){
                setAirplayDevices(new Map(airplay_res.data.map((device: {
                    id: string;
                    name: string;
                    address: string;
                    model: string;
                }) => [device.address, {
                    id: device.id,
                    name: device.name,
                    model: device.model,
                    address: device.address,
                    loading: false,
                    connected: false
                }])));

                setChromecastDevices(new Map(chromecast_res.data.map((device: {
                    id: string;
                    name: string;
                    address: string;
                    model: string;
                }) => [device.address, {
                    id: device.id,
                    name: device.name,
                    model: device.model,
                    address: device.address,
                    loading: false,
                    connected: false
                }])));
            }
            else{
                setToast({title: "Error", message: airplay_res.message, type: toastType.error, timeout: 3000});
                return
            }
            setIsScanning(false);
        } catch(err: any){
            setToast({title: "Error", message: err, type: toastType.error, timeout: 3000});
            setIsScanning(false);
        }
    }

    function connectAirplay(device: AirplayCastDevice){
        device.loading = true;
        setAirplayDevices(new Map(airplay_devices.set(device.address, device)));

        if(device.connected){
            invoke("airplay_disconnect", {deviceIdentifier: device.id}).then(() => {
                device.connected = false;
                setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            }).catch((err) => {
                device.loading = false;
                setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
                setToast({title: "Error", message: err, type: toastType.error, timeout: 3000});
            });
        } else{
            invoke("airplay_pair", {deviceIdentifier: device.id}).then(() => {
                device.loading = false;
                setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
                setSelectedAirplayDevice(device);
            }).catch((err) => {
                device.loading = false;
                setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
                setToast({title: "Error", message: err, type: toastType.error, timeout: 3000});
            });
        }
    }

    function connectChromecast(device: AirplayCastDevice){
        if(device.connected){
            device.connected = false;
            setChromecastDevices(new Map(chromecast_devices.set(device.address, device)));
            return;
        }
        else{
            device.connected = true;
            setChromecastDevices(new Map(chromecast_devices.set(device.address, device)));
        }
    }

    function connectPinAirplay(device: AirplayCastDevice, pin: string){
        setSelectedAirplayDevice(null);
        if(pin === ""){
            setToast({title: "Error", message: "Pin cannot be empty", type: toastType.error, timeout: 3000});
            return;
        }
        device.loading = true;
        setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
        invoke("airplay_pin", {pin: pin}).then(() => {
            device.connected = true;
            device.loading = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            setToast({title: "Connected", message: `Connected to ${device.name}`, type: toastType.info, timeout: 3000});
        }).catch((err) => {
            device.loading = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            setToast({title: "Error", message: err, type: toastType.error, timeout: 3000});
        });
    }

    function disconnectAirplay(device: AirplayCastDevice){
        device.loading = true;
        setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
        invoke("airplay_disconnect", {deviceIdentifier: device.id}).then(() => {
            device.connected = false;
            device.loading = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
        }).catch((err) => {
            device.loading = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            setToast({title: "Error", message: err, type: toastType.error, timeout: 3000});
        });
    }

    function disconnectChromecast(device: AirplayCastDevice){
        device.connected = false;
        setChromecastDevices(new Map(chromecast_devices.set(device.address, device)));
    }

    function GetIcon(device: AirplayCastDevice){
        if(device.name.toLowerCase().includes("tv") || device.model.toLowerCase().includes("tv")) return <TV />;
        else if(device.name.toLowerCase().includes("speaker") || (device.name.toLowerCase().includes("homepod")) 
            || device.model.toLowerCase().includes("speaker") || (device.model.toLowerCase().includes("homepod"))) return <Speaker />;
        else if(device.name.toLowerCase().includes("pod") || device.model.toLowerCase().includes("pod")) return <Headphones />;
        else if(device.name.toLowerCase().includes("computer") || device.model.toLowerCase().includes("computer")) return <Computer />;
        else if(device.name.toLowerCase().includes("laptop") || device.model.toLowerCase().includes("laptop")) return <Laptop />;
        else return <Computer />;
    }

    useEffect(() => {
        if(props.isOpen){
            scan();
        }
    }, [props.isOpen]);

    return (
        <div className={"AirplayCastModal" + (props.isOpen ? " AirplayCastModal-visible" : "")} onClick={
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => 
                {if(e.target === e.currentTarget)props.closeModal()}}>
            <motion.div 
            animate={props.isOpen ? "open" : "closed"}
            variants={modal_variants}
            className="modal">
                <h2>Airplay devices</h2>
                <div className="devices-list">
                    {airplay_devices.size === 0 && !isScanning && (<h3>No airplay devices found</h3>)}
                    {isScanning && 
                        <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" width={390} height={40} borderRadius={13}>
                            <Skeleton count={1} style={{marginBottom: "5px"}}/>
                            <Skeleton count={1} style={{marginBottom: "5px"}}/>
                            <Skeleton count={1}/>
                        </SkeletonTheme>
                    }
                    {!isScanning && Array.from(airplay_devices.values()).map(device => 
                        <motion.div className="device-container" whileTap={{scale: 0.98}} onClick={device.connected ? () => disconnectAirplay(device) : () => connectAirplay(device)}>
                            <div className="icon">{GetIcon(device)}</div>
                            <h3>{device.name}</h3>
                            {device.loading && <div className="status"><WifiLoader/></div>}
                            {device.connected && <div className="status"><Check /></div>}
                        </motion.div>)}
                </div>
                <h2>Chromecast devices</h2>
                <div className="devices-list">
                    {chromecast_devices.size === 0 && !isScanning && (<h3>No chromecast devices found</h3>)}
                    {isScanning && 
                        <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" width={390} height={40} borderRadius={13}>
                            <Skeleton count={1} style={{marginBottom: "5px"}}/>
                            <Skeleton count={1} style={{marginBottom: "5px"}}/>
                            <Skeleton count={1} />
                        </SkeletonTheme>
                    }
                    {!isScanning && Array.from(chromecast_devices.values()).map(device => 
                        <motion.div className="device-container" whileTap={{scale: 0.98}} onClick={device.connected ? () => disconnectChromecast(device) : () => connectChromecast(device)}>
                            <div className="icon">{GetIcon(device)}</div>
                            <h3>{device.name}</h3>
                            {device.loading && <div className="status"><WifiLoader/></div>}
                            {device.connected && <div className="status"><Check /></div>}
                        </motion.div>)}
                </div>
                <motion.div className="scan_button" whileTap={{scale: 0.98}} onClick={scan}>
                    <h3>Scan for devices</h3>
                </motion.div>
            </motion.div>

            <AirplayPinModal 
                title={selectedAirplayDevice?.name ?? ""}
                isOpen={selectedAirplayDevice !== null}
                Icon={() => GetIcon(selectedAirplayDevice ?? {
                    id: "",
                    name: "",
                    model: "",
                    address: "",
                    loading: false,
                    connected: false
                })} 
                onAirPlayPin={(pin) => connectPinAirplay(selectedAirplayDevice ?? {
                    id: "",
                    name: "",
                    model: "",
                    address: "",
                    loading: false,
                    connected: false
                }, pin)} />
        </div>
    )
}

export default AirplayCastModal