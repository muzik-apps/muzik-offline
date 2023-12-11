import { motion } from "framer-motion";
import { useState } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllGenres.scss";
import { mouse_coOrds, genreDetails, contextMenuEnum } from "types";
import { playlist1, playlist2, playlist3, playlist4, playlist5, playlist6, playlist7, playlist8 } from "@assets/index";

const genres: genreDetails[] = [
    {
        key: 1,
        cover: playlist1,
        title: "genre 1",

    },
    {
        key: 2,
        cover: playlist2,
        title: "genre 2",

    },
    {
        key: 3,
        cover: playlist3,
        title: "genre 3",

    },
    {
        key: 4,
        cover: playlist4,
        title: "genre 4",

    },
    {
        key: 5,
        cover: playlist5,
        title: "genre 5",

    },
    {
        key: 6,
        cover: playlist6,
        title: "genre 6",

    },
    {
        key: 7,
        cover: playlist7,
        title: "genre 7",

    },
    {
        key: 8,
        cover: playlist8,
        title: "genre 8",

    }
]

const AllGenres = () => {
    
    const [sort, setSort] = useState<string>("Ascending");
    const [openedDDM, setOpenedDDM] = useState<boolean>(false);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [genreMenuToOpen, setGenreMenuToOpen] = useState<genreDetails | null>(null);

    function selectOption(arg: string){
        if(arg !== sort)setSort(arg); 
        setOpenedDDM(false);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_genre = genres.find(genre => { return genre.key === key; })
        setGenreMenuToOpen(matching_genre ? matching_genre : null);
    }
    
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
                            CMtype={contextMenuEnum.GenreCM}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
        </motion.div>
    )
}

export default AllGenres