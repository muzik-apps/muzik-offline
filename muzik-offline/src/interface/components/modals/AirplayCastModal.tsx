import { modal_variants } from "@content/index";
import "@styles/components/modals/AirplayCastModal.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import AirplayPinModal from "./AirplayPinModal";
import { Check, Computer, Headphones, Laptop, Speaker, TV, WifiLoader } from "@assets/icons";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useAirplayManager, useToastStore, useChromeCastManager } from "@store/index";
import { toastType } from "@muziktypes/index";
import { ChildProcess } from '@tauri-apps/plugin-shell';
import { getChildProcess, getCommandProgram } from "@utils/index";

type AirplayCastModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

type Device = {
    id: string;
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
    const { airplay_child, airplay_shell, setAirplayMembers, } = useAirplayManager((state) => { return { 
        airplay_child: state.airplay_child, 
        airplay_shell: state.airplay_shell, 
        setAirplayMembers: state.setMembers,
    }; });
    const { cast_child, cast_shell, setChromecastMembers } = useChromeCastManager((state) => { return { 
        cast_child: state.cast_child, 
        cast_shell: state.cast_shell, 
        setChromecastMembers: state.setMembers,
    }; });

    async function getShellAndChild(type: "Airplay" | "Chromecast"){
        if(type === "Airplay"){
            if(airplay_shell !== null && airplay_child !== null) return {shell: airplay_shell, child: airplay_child};
            console.log("Creating airplay shell and child");
            const airplaySHL = await getCommandProgram(airplay_shell, "airplay");
            const output = await airplaySHL.execute();
            console.log(output);
            console.log(airplaySHL);
            const child = await getChildProcess(airplaySHL, airplay_child);
            console.log(child);
            setAirplayMembers(child, airplaySHL);
            return {shell: airplaySHL, child: child};
        }
        else{
            if(cast_shell !== null && cast_child !== null) return {shell: cast_shell, child: cast_child};
            const chromecastSHL = await getCommandProgram(cast_shell, "audio-cast/dist/chromecast/chromecast");
            const child = await getChildProcess(chromecastSHL, cast_child);
            setChromecastMembers(child, chromecastSHL);
            return {shell: chromecastSHL, child: child};
        }
    }

    async function scan(){
        try{
            setIsScanning(true);
            console.log("Scanning for devices");
            const airplay_processes = await getShellAndChild("Airplay");
            console.log(airplay_processes);
            //scan for airplay devices
            airplay_processes.child.write("scan\n");
            airplay_processes.shell.execute().then((output: ChildProcess<string>) => {
                const devices = output.stdout;
                // incoming format is {"status": "success", "message": "any message", "data": [{"id", "name", "address", "model"}]}
                const res = JSON.parse(devices);
                if(res.status === "success"){
                    setAirplayDevices(new Map(res.data.map((device: {
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
                    setToast({title: "Error", message: res.message, type: toastType.error, timeout: 3000});
                }
            });
            /*
            //scan for chromecast devices
            const chromecast_processes = await getShellAndChild("Chromecast");
            chromecast_processes.child.write("scan\n");
            chromecast_processes.shell.execute().then((output: ChildProcess<string>) => {
                const devices = output.stdout;
                // incoming format is {"status": "success", "message": "any message", "data": [{"id", "name", "address", "model"}]}
                const res = JSON.parse(devices);
                if(res.status === "success"){
                    setChromecastDevices(new Map(res.data.map((device: {
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
                    setToast({title: "Error", message: res.message, type: toastType.error, timeout: 3000});
                }
            });*/
            setIsScanning(false);
        }catch(e: any){
            setToast({title: "Error", message: e, type: toastType.error, timeout: 3000});
            console.log(e);
            setIsScanning(false);
        }
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