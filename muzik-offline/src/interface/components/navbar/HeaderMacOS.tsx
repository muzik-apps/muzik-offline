import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Prev_page, Next_page, Search, Cross, SettingsIcon } from "@icons/index";
import { App_logo } from "@logos/index";
import { FunctionComponent, useState } from 'react';

type HeaderMacOSProps = {
    toggleSettings: () => void;
}

const HeaderMacOS: FunctionComponent<HeaderMacOSProps>  = (props: HeaderMacOSProps) => {

    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");

    function captureSearch(e: React.ChangeEvent<HTMLInputElement>){
        setSearchText(e.target.value);
        //set global search text
    }

    function searchFor(){
        //set complete search global variable to true
    }

    function clearSearch(){
        setSearchText("");
    }
    
    return (
        <div className="Header">
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
                    <SettingsIcon />
                    <h2>Settings</h2>
                </motion.div>
            </div>
        </div>
    )
}

export default HeaderMacOS