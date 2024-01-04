import "@styles/components/navbar/Header.scss";
import { Prev_page, Next_page, Search, Cross, Empty_user } from "@icons/index";
import { motion } from "framer-motion";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { App_logo } from "@logos/index";
import { useSearchStore } from "store";

type HeaderLinuxOSProps = {
    toggleSettings: () => void;
}

const HeaderLinuxOS: FunctionComponent<HeaderLinuxOSProps> = (props: HeaderLinuxOSProps)  => {
    
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<string>("");
    const { setSearch } = useSearchStore((state) => { return { setSearch: state.setSearch}; });

    function captureSearch(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.value === "enter")searchFor();
        else setSearchText(e.target.value); 
    }

    function searchFor(){ setSearch(searchText); }

    function clearSearch(){
        setSearchText("");
        setSearch("");
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
                    <Empty_user />
                    <h2>settings</h2>
                </motion.div>
            </div>
        </div>
    )
}

export default HeaderLinuxOS
