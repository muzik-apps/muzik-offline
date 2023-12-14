import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllGenres.scss";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, Song, genre } from "types";
import useLocalStorageState from "use-local-storage-state";

const AllGenres = () => {
    
    const [sort, setSort] = useState<string>("Ascending");
    const [openedDDM, setOpenedDDM] = useState<boolean>(false);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [genreMenuToOpen, setGenreMenuToOpen] = useState<genre | null>(null);
    const [genres, setAlbums] = useState<genre[]>([]);
    const [SongList,] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});
    const genresLoaded = useRef<boolean>(false);

    function selectOption(arg: string){
        if(arg !== sort)setSort(arg); 
        setOpenedDDM(false);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_genre = genres.find(genre => { return genre.key === key; })
        setGenreMenuToOpen(matching_genre ? matching_genre : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    useEffect(() => {
        const findGenre = () => {
            if(genresLoaded.current === true)return;
            genresLoaded.current = true;
            const uniqueSet: Set<string> = new Set();
            const genres_list = SongList.map((song) => {
                if (!uniqueSet.has(song.genre)) {
                    uniqueSet.add(song.genre);
                    return song.genre;
                }
                return null; // Returning null for elements that are not added to the uniqueArray
            }).filter((element) => {
                return element !== null; // Filtering out elements that were not added to the uniqueArray
            });

            genres_list.map((genre_str, index) => { 
                if(genre_str !== null)setAlbums(oldArray => [...oldArray, { key: index, cover: "No cover", title: genre_str}]);
            });
        }
        
        findGenre();
    }, [SongList])
    
    return (
        <motion.div className="AllGenres"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllGenres_title">
                <h1>All genres</h1>
                <div className="sort_selector">
                    <h2>Sort A-Z: </h2>
                    <div className="sort_dropdown_container">
                        <motion.div className="sort_dropdown" whileTap={{scale: 0.98}} whileHover={{scale: 1.03}} onClick={() => setOpenedDDM(!openedDDM)}>
                            <h4>{sort}</h4>
                            <motion.div className="chevron_icon" animate={{rotate: openedDDM ? 180 : 0}}>
                                <ChevronDown />
                            </motion.div>
                        </motion.div>
                        <div className="DropDownMenu_container">
                            <DropDownMenuSmall
                                options={["Ascending", "Descending"]} 
                                isOpen={openedDDM}
                                selectOption={selectOption}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="AllGenres_container">
                {genres.map((genre) => 
                    <SquareTitleBox 
                        key={genre.key}
                        cover={genre.cover} 
                        title={genre.title}
                        keyV={genre.key}
                        setMenuOpenData={setMenuOpenData}
                    />)}
            </div>
            {
                genreMenuToOpen && (
                    <div className="AllGenres-ContextMenu-container" 
                    onClick={() => {
                        setGenreMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setGenreMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={genreMenuToOpen.title} 
                            CMtype={contextMenuEnum.GenreCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
        </motion.div>
    )
}

export default AllGenres