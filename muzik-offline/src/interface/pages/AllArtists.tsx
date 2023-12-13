import { motion } from "framer-motion";
import { useState } from "react";
import { DropDownMenuSmall, SquareTitleBox, GeneralContextMenu } from "@components/index";
import { ChevronDown } from "@assets/icons";
import "@styles/pages/AllArtists.scss";
import { mouse_coOrds, contextMenuEnum, artistDetails } from "types";
import { artist1, artist2, artist3, artist4, artist5 } from "@assets/index";

const artists: artistDetails[] = [
    {
        key: 0,
        cover: artist1,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 1,
        cover: artist2,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 2,
        cover: artist3,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 3,
        cover: artist4,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 4,
        cover: artist5,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 5,
        cover: artist4,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 6,
        cover: artist3,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 7,
        cover: artist2,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 8,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 9,
        cover: artist1,
        artist_name: "artist 1",
        favourited: true
    },
    {
        key: 10,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 11,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 12,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 13,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 14,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 15,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 16,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
    {
        key: 17,
        cover: artist1,
        artist_name: "artist 1",
        favourited: false
    },
]

const AllArtists = () => {
    
    const [sort, setSort] = useState<string>("Ascending");
    const [openedDDM, setOpenedDDM] = useState<boolean>(false);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [artistMenuToOpen, setArtistMenuToOpen] = useState<artistDetails | null>(null);

    function selectOption(arg: string){
        if(arg !== sort)setSort(arg); 
        setOpenedDDM(false);
    }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_artist = artists.find(artist => { return artist.key === key; })
        setArtistMenuToOpen(matching_artist ? matching_artist : null);
    }
    
    return (
        <motion.div className="AllArtists"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="AllArtists_title">
                <h1>All artists</h1>
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
            <div className="AllArtists_container">
                {artists.map((artist) => 
                    <SquareTitleBox 
                        key={artist.key}
                        cover={artist.cover} 
                        title={artist.artist_name}
                        keyV={artist.key}
                        setMenuOpenData={setMenuOpenData}
                    />)}
            </div>
            {
                artistMenuToOpen && (
                    <div className="AllArtists-ContextMenu-container" 
                    onClick={() => {
                        setArtistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setArtistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={artistMenuToOpen.artist_name}
                            CMtype={contextMenuEnum.ArtistCM}/>
                    </div>
                )
            }
            <div className="bottom_margin"/>
        </motion.div>
    )
}

export default AllArtists