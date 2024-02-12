import { Disk, LayersThree, Menu, Microphone, MusicalNote } from "@assets/icons";
import { SearchNavigator } from "@components/index";
import { SearchAlbums, SearchArtists, SearchGenres, SearchPlaylists, SearchSongs } from "@layouts/index";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "@styles/pages/SearchPage.scss";
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from "react";

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState<string>(location.pathname.replace("/SearchPage/", ""));

    function setSelectedF(arg: string){ 
        setSelected(arg);
        navigate(`/SearchPage/${arg}`);
    }

    useEffect(() => { setSelected(location.pathname.replace("/SearchPage/", "")); }, [location]);
    
    return (
        <motion.div className="SearchPage"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="SearchPage-navigator">
                <SearchNavigator icon={MusicalNote} text={"songs"} selected={selected} select={setSelectedF}/>
                <SearchNavigator icon={Microphone} text={"artists"} selected={selected} select={setSelectedF}/>
                <SearchNavigator icon={LayersThree} text={"albums"} selected={selected} select={setSelectedF}/>
                <SearchNavigator icon={Disk} text={"genres"} selected={selected} select={setSelectedF}/>
                <SearchNavigator icon={Menu} text={"playlists"} selected={selected} select={setSelectedF}/>
            </div>
            <div className="content-container">
                <Routes>
                    <Route index path="songs" element={<SearchSongs/>}/>
                    <Route path="artists" element={<SearchArtists/>}/>
                    <Route path="albums" element={<SearchAlbums/>}/>
                    <Route path="genres" element={<SearchGenres/>}/>
                    <Route path="playlists" element={<SearchPlaylists/>}/>
                </Routes>
            </div>
        </motion.div>
    )
}

export default SearchPage
