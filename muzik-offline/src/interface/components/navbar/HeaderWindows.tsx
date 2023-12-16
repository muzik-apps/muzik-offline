import { FunctionComponent, useEffect, useState } from "react";
import { appWindow } from '@tauri-apps/api/window';
import {min_w_10,min_w_12,min_w_15,min_w_20,min_w_24,min_w_30,max_w_10,max_w_12,max_w_15,max_w_20,max_w_24,max_w_30,
    restore_w_10,restore_w_12,restore_w_15,restore_w_20,restore_w_24,restore_w_30,
    close_w_10,close_w_12,close_w_15,close_w_20,close_w_24,close_w_30
} from "@icons/windows_icons";
import "@styles/components/navbar/Header.scss";
import { Prev_page, Next_page, Search, Cross, Empty_user } from "@icons/index";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { App_logo } from "@logos/index";
import { useSearchStore } from "store";

type HeaderWindowsProps = {
    toggleSettings: () => void;
}

const HeaderWindows: FunctionComponent<HeaderWindowsProps> = (props: HeaderWindowsProps) => {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");
    const { setSearch } = useSearchStore((state) => { return { setSearch: state.setSearch}; });

    function captureSearch(e: React.ChangeEvent<HTMLInputElement>){ setSearchText(e.target.value); }

    function searchFor(){ setSearch(searchText); }

    function clearSearch(){
        setSearchText("");
        setSearch("");
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
            }
            else{
                const maximizebtn: HTMLElement | null = document.getElementById("maximize");
                const restorebtn: HTMLElement | null = document.getElementById("restore");
        
                if(maximizebtn)maximizebtn.style.visibility = "visible";
                if(restorebtn)restorebtn.style.visibility = "hidden";
            }
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
                    onFocus={() => navigate("/SearchPage")}/>
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
                <div className="window_controls_section">
                    <div className="button_area" id="minimize">
                        <img className="icon" srcSet={`${min_w_10} 1x, ${min_w_12} 1.25x, ${min_w_15} 1.5x, ${min_w_15} 1.75x,
                            ${min_w_20} 2x, ${min_w_20} 2.25x, ${min_w_24} 2.5x, ${min_w_30} 3x, ${min_w_30} 3.5x`}/>
                    </div>
                    <div className="inter_changeable_btn">
                        <div className="button_area" id="maximize">
                            <img className="icon" srcSet={`${max_w_10} 1x, ${max_w_12} 1.25x, ${max_w_15} 1.5x, ${max_w_15} 1.75x,
                                ${max_w_20} 2x, ${max_w_20} 2.25x, ${max_w_24} 2.5x, ${max_w_30} 3x, ${max_w_30} 3.5x`}/>
                        </div>
                        <div className="button_area" id="restore">
                            <div className="restore_sub_area">
                                <img className="icon" srcSet={`${restore_w_10} 1x, ${restore_w_12} 1.25x, ${restore_w_15} 1.5x, ${restore_w_15} 1.75x,
                                    ${restore_w_20} 2x, ${restore_w_20} 2.25x, ${restore_w_24} 2.5x, ${restore_w_30} 3x, ${restore_w_30} 3.5x`}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="button_area" id="close">
                        <img className="icon" srcSet={`${close_w_10} 1x, ${close_w_12} 1.25x, ${close_w_15} 1.5x, ${close_w_15} 1.75x,
                            ${close_w_20} 2x, ${close_w_20} 2.25x, ${close_w_24} 2.5x, ${close_w_30} 3x, ${close_w_30} 3.5x`}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderWindows
