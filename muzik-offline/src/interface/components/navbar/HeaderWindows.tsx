import { FunctionComponent, useEffect, useState } from "react";
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import "@styles/components/navbar/Header.scss";
import { Prev_page, Next_page, Search, Cross, Empty_user, WindowsCloseIcon, WindowsMaximizeIcon, WindowsMinimizeIcon, WindowsRestoreIcon } from "@icons/index";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { App_logo } from "@logos/index";
import { useIsMaximisedStore, useSearchStore } from "store";
const appWindow = getCurrentWebviewWindow();

type HeaderWindowsProps = {
    toggleSettings: () => void;
}

const HeaderWindows: FunctionComponent<HeaderWindowsProps> = (props: HeaderWindowsProps) => {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");
    const [isFS, setIsFS] = useState<boolean>(false);
    const { setSearch } = useSearchStore((state) => { return { setSearch: state.setSearch}; });
    const { setMaximised } = useIsMaximisedStore((state) => { return { setMaximised: state.setMaximised}; });

    function captureSearch(e: any){setSearchText(e.target.value);}

    function searchFor(){ setSearch(searchText); }

    function clearSearch(){
        setSearchText("");
        setSearch("");
    }

    function detectKey(e: any){
        if(e.ctrlKey && e.shiftKey && e.code === "KeyF"){
            e.preventDefault(); 
            props.toggleSettings();
        }
        else if(e.ctrlKey && e.code === "KeyS"){
            e.preventDefault();
            const searchbar: HTMLElement | null = document.getElementById("gsearch");
            if(searchbar)searchbar.focus();
        }
        else if(e.code === "Enter")searchFor();
    }
    
    useEffect(() => {
        const minimizeID: HTMLElement | null = document.getElementById('minimize');
        const maximizeID: HTMLElement | null = document.getElementById('maximize');
        const restoreID: HTMLElement | null = document.getElementById('restore');
        const closeID: HTMLElement | null = document.getElementById('close');
    
        const handleScreenResize = async() => {
            const isMaximized: boolean = await appWindow.isMaximized();
            if(isMaximized === true){
                const maximizebtn: HTMLElement | null = document.getElementById("maximize");
                const restorebtn: HTMLElement | null = document.getElementById("restore");
        
                if(maximizebtn)maximizebtn.style.visibility = "hidden";
                if(restorebtn)restorebtn.style.visibility = "visible";
                setMaximised(true);
            }
            else{
                const maximizebtn: HTMLElement | null = document.getElementById("maximize");
                const restorebtn: HTMLElement | null = document.getElementById("restore");
        
                if(maximizebtn)maximizebtn.style.visibility = "visible";
                if(restorebtn)restorebtn.style.visibility = "hidden";
                setMaximised(false);
            }
            const fs_conf: boolean = await appWindow.isFullscreen();
            setIsFS(fs_conf);
        }
    
        window.addEventListener("resize", handleScreenResize);
        if(minimizeID)minimizeID.addEventListener('click', () => appWindow.minimize());
        if(maximizeID)maximizeID.addEventListener('click', () => appWindow.toggleMaximize());
        if(restoreID)restoreID.addEventListener('click', () => appWindow.toggleMaximize());
        if(closeID)closeID.addEventListener('click', () => appWindow.close());
        
        return () => {
            window.removeEventListener("resize", handleScreenResize);
            if(minimizeID)minimizeID.removeEventListener('click', () => appWindow.minimize());
            if(maximizeID)maximizeID.removeEventListener('click', () => appWindow.toggleMaximize());
            if(restoreID)restoreID.removeEventListener('click', () => appWindow.toggleMaximize());
            if(closeID)closeID.removeEventListener('click', () => appWindow.close());
        };
    }, [])

    useEffect(() => {
        document.addEventListener("keypress", detectKey);
        return () => document.removeEventListener("keypress", detectKey);
    }, [searchText, props.toggleSettings])
    
    return (
        <div data-tauri-drag-region className="Header">
            <div className="app_logo"><App_logo /></div>
            <div className="app_navigation">
                <motion.div className="navigators" whileTap={{scale: 0.97}} onClick={() => navigate(-1)}><Prev_page /></motion.div>
                <motion.div className="navigators" whileTap={{scale: 0.97}} onClick={() => navigate(1)}><Next_page /></motion.div>
            </div>
            <div className="searchbar">
                <motion.div onClick={searchFor} whileTap={{scale: 0.97}}>
                    <Search />
                </motion.div>
                <input 
                    value={searchText}
                    type="text" 
                    id="gsearch" 
                    placeholder="Search..."
                    onChange={captureSearch} 
                    onFocus={() => navigate("/SearchPage/songs")}/>
                {
                    searchText !== "" &&
                    <motion.div onClick={clearSearch} whileTap={{scale: 0.97}}>
                        <Cross />
                    </motion.div>
                }
            </div>
            <div className="user_controls">
                <motion.div className="user_account" whileTap={{scale: 0.97}} whileHover={{scale: 1.03}} onClick={props.toggleSettings}>
                    <Empty_user />
                    <h2>settings</h2>
                </motion.div>
                <div className={"window_controls_section " + (isFS === true ? "window_controls_section-hidden" : "")}>
                    <div className="button_area" id="minimize">
                        <WindowsMinimizeIcon />
                    </div>
                    <div className="inter_changeable_btn">
                        <div className="button_area" id="maximize">
                            <WindowsMaximizeIcon />
                        </div>
                        <div className="button_area" id="restore">
                            <div className="restore_sub_area">
                                <WindowsRestoreIcon />
                            </div>
                        </div>
                    </div>
                    <div className="button_area" id="close">
                        <WindowsCloseIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderWindows
