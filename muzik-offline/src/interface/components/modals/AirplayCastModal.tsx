import { modal_variants } from "@content/index";
import "@styles/components/modals/AirplayCastModal.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import AirplayPinModal from "./AirplayPinModal";
import { Check, Computer, Headphones, Laptop, Speaker, TV, WifiLoader } from "@assets/icons";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useToastStore } from "@store/index";
import { toastType } from "@muziktypes/index";

type AirplayCastModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

type Device = {
    name: string;
    model: string;
    address: string;
    loading: boolean;
    connected: boolean;
}

const AirplayCastModal = (props: AirplayCastModalProps) => {
    const [chromecast_devices, setChromecastDevices] = useState<Map<string, Device>>(new Map());
    const [airplay_devices, setAirplayDevices] = useState<Map<string, Device>>(new Map());
    const [selectedAirplayDevice, setSelectedAirplayDevice] = useState<Device | null>(null);
    const [selectedChromecastDevice, setSelectedChromecastDevice] = useState<Device | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { setToast } = useToastStore((state) => { return { setToast: state.setToast }; });

    function scan(){
        setIsScanning(true);
        //scan for airplay devices
        //simulate fetching devices
        setTimeout(() => {
            setIsScanning(false);
            setAirplayDevices(new Map([
                [ "10.0.0.1", {
                        name: "Living Room TV",
                        model: "TV",
                        address: "10.0.0.1",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.2", {
                        name: "HomePod",
                        model: "Speaker",
                        address: "10.0.0.2",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.3", {
                        name: "Bedroom Speaker",
                        model: "Speaker",
                        address: "10.0.0.3",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.4", {
                        name: "Office Computer",
                        model: "Computer",
                        address: "10.0.0.4",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.5", {
                    name: "John Doe's Airpods Pro",
                    model: "Airpod Pro 2",
                    address: "10.0.0.5",
                    loading: false,
                    connected: false
                }
            ],
            ]));
            setChromecastDevices(new Map([
                [ "10.0.0.1", {
                        name: "Living Room TV",
                        model: "TV",
                        address: "10.0.0.1",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.2", {
                        name: "HomePod",
                        model: "Speaker",
                        address: "10.0.0.2",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.3", {
                        name: "Bedroom Speaker",
                        model: "Speaker",
                        address: "10.0.0.3",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.4", {
                        name: "Office Computer",
                        model: "Computer",
                        address: "10.0.0.4",
                        loading: false,
                        connected: false
                    }
                ],
                [ "10.0.0.5", {
                        name: "John Doe's Airpods Pro",
                        model: "Airpod Pro 2",
                        address: "10.0.0.5",
                        loading: false,
                        connected: false
                    }
                ],
            ]));
        }, 2000);
        //scan for chromecast devices
    }

    function connectAirplay(device: Device){
        if(device.connected){
            device.connected = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            return;
        }
        //simulate connect to airplay device
        device.loading = true;
        setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
        setTimeout(() => {
            device.loading = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            setSelectedAirplayDevice(device);
        }, 2000);
    }

    function connectChromecast(device: Device){
        if(device.connected){
            device.connected = false;
            setChromecastDevices(new Map(chromecast_devices.set(device.address, device)));
            return;
        }
        //simulate connect to chromecast device
        device.loading = true;
        setChromecastDevices(new Map(chromecast_devices.set(device.address, device)));
        setTimeout(() => {
            device.loading = false;
            device.connected = true;
            setChromecastDevices(new Map(chromecast_devices.set(device.address, device)));
            setSelectedChromecastDevice(device);
            setToast({title: "Connected", message: `Connected to ${device.name}`, type: toastType.info, timeout: 3000});
        }, 2000);
    }

    function connectPinAirplay(device: Device, pin: string){
        setSelectedAirplayDevice(null);
        if(pin === ""){
            return;
        }
        device.loading = true;
        setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
        setTimeout(() => {
            device.connected = true;
            device.loading = false;
            setAirplayDevices(new Map(airplay_devices.set(device.address, device)));
            setToast({title: "Connected", message: `Connected to ${device.name}`, type: toastType.info, timeout: 3000});
        }, 2000);
    }

    function GetIcon(device: Device){
        if(device.name.toLowerCase().includes("tv") || device.model.toLowerCase().includes("tv")) return <TV />;
        else if(device.name.toLowerCase().includes("speaker") || (device.name.toLowerCase().includes("homepod")) 
            || device.model.toLowerCase().includes("speaker") || (device.model.toLowerCase().includes("homepod"))) return <Speaker />;
        else if(device.name.toLowerCase().includes("pod") || device.model.toLowerCase().includes("pod")) return <Headphones />;
        else if(device.name.toLowerCase().includes("computer") || device.model.toLowerCase().includes("computer")) return <Computer />;
        else if(device.name.toLowerCase().includes("laptop") || device.model.toLowerCase().includes("laptop")) return <Laptop />;
        else return <Computer />;
    }

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
                        <motion.div className="device-container" whileTap={{scale: 0.98}} onClick={() => connectAirplay(device)}>
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
                        <motion.div className="device-container" whileTap={{scale: 0.98}} onClick={() => connectChromecast(device)}>
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
                    name: "",
                    model: "",
                    address: "",
                    loading: false,
                    connected: false
                })} 
                onAirPlayPin={(pin) => connectPinAirplay(selectedAirplayDevice ?? {
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