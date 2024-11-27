import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Prev_page, Next_page, Search, Cross, Empty_user } from "@icons/index";
import { App_logo } from "@logos/index";
import { FunctionComponent, useEffect, useState } from 'react';
import { useSearchStore } from 'store';

type HeaderMacOSProps = {
    toggleSettings: () => void;
}

const HeaderMacOS: FunctionComponent<HeaderMacOSProps>  = (props: HeaderMacOSProps) => {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");
    const { setSearch } = useSearchStore((state) => { return { setSearch: state.setSearch}; });

    function captureSearch(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.value === "Enter")searchFor();
        else setSearchText(e.target.value); 
    }

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
        document.addEventListener("keypress", detectKey);
        return () => document.removeEventListener("keypress", detectKey);
    }, [searchText, props.toggleSettings])
    
    return (
        <div data-tauri-drag-region className="Header">
            <div className='macos_windows_controls'/>
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
            </div>
        </div>
    )
}

export default HeaderMacOS