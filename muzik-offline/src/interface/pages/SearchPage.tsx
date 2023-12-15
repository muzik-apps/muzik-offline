import { Disk, LayersThree, Menu, Microphone, MusicalNote } from "@assets/icons";
import { SearchNavigator } from "@components/index";
import {SearchAlbums, SearchArtists, SearchGenres, SearchPlaylists, SearchSongs} from "@layouts/index";
import { motion } from "framer-motion";
import { useState } from "react";
import "@styles/pages/SearchPage.scss";

const SearchPage = () => {
    const [selected, setSelected] = useState<string>("songs");

    function setSelectedF(arg: string){ 
        setSelected(arg);
    }

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
                {
                    selected === "songs" ?
                        <SearchSongs />
                    : selected === "artists" ?
                        <SearchArtists />
                    : selected === "albums" ?
                        <SearchAlbums />
                    : selected === "genres" ?
                        <SearchGenres />
                    :
                        <SearchPlaylists />
                }
            </div>
        </motion.div>
    )
}

export default SearchPage