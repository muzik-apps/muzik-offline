import { Play, Shuffle } from "@assets/icons";
import { GeneralContextMenu, LargeResizableCover, SquareTitleBox } from "@components/index";
import { album, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getArtistsAlbums, secondsToTimeFormat } from "utils";
import { useNavigate } from "react-router-dom";
import "@styles/pages/ArtistCatalogue.scss";

interface ArtistMD {cover: string | null;artistName: string;album_count: number;song_count: number;length: string;}

const emptyMD: ArtistMD = {cover: null,artistName: "",album_count: 0,song_count: 0,length: ""}

const ArtistCatalogue = () => {

    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [albums, setAlbums] = useState<album[]>([]);
    const [artist_metadata, setArtistMetadata] = useState<ArtistMD>(emptyMD);
    const [albumMenuToOpen, setAlbumMenuToOpen] = useState<album | null>(null);
    
    const [resizeHeader, setResizeHeader] = useState<boolean>(false);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { artist_name } = useParams(); 

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_album = albums.find(album => { return album.key === key; })
        setAlbumMenuToOpen(matching_album ? matching_album : null);
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowAlbum && albumMenuToOpen){
            navigateTo(albumMenuToOpen.key);
        }
    }

    function handleScroll(){
        const scrollY = itemsHeightRef.current?.scrollTop ?? 0;
        // NOTE: The following console.log might affect the timing of the code execution.
        // If you experience issues with state updates, it's recommended to investigate
        // potential asynchronous behavior and consider removing or adjusting this log.
        console.log;
        if(scrollY === 0){
            setResizeHeader(false);
        }
        else if(resizeHeader === false){
            setResizeHeader(true);
        }
    };

    async function setArtistAlbums(){
        if(artist_name === undefined)return;
        const result = await getArtistsAlbums(artist_name);
        setArtistMetadata({
            cover: result.cover,
            artistName: artist_name,
            album_count: result.albums.length,
            song_count: result.song_count,
            length: secondsToTimeFormat(result.totalDuration)
        });
        setAlbums(result.albums);
    }

    function navigateTo(passed_key: number){ navigate(`/AlbumDetails/${passed_key}/${artist_metadata.artistName}`); }

    useEffect(() => {
        setArtistAlbums();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <motion.div className="ArtistCatalogue"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={"1"} resizeHeader={resizeHeader} cover={artist_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: resizeHeader ? "25px" : "68px" }}>{artist_metadata.artistName}</h2>
                    { !resizeHeader &&
                        <>
                            <h4>{artist_metadata.album_count} albums</h4>
                            <h4>{artist_metadata.song_count} songs</h4>
                            <div className="action_buttons">
                                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Play />
                                    <p>play</p>
                                </motion.div>
                                <motion.div className="ShuffleIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Shuffle />
                                    <p>Shuffle</p>
                                </motion.div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className="main_content" ref={itemsHeightRef} style={{height: !resizeHeader ? "calc(100vh - 325px)" : "calc(100vh - 160px)"}}>
                {albums.map((album) => 
                    <SquareTitleBox 
                    key={album.key}
                    cover={album.cover} 
                    title={album.title}
                    keyV={album.key}
                    navigateTo={navigateTo}
                    setMenuOpenData={setMenuOpenData}/>
                )}
                <div className="footer_content"/>
            </div>
            {
                albumMenuToOpen && (
                    <div className="ArtistCatalogue-ContextMenu-container" 
                    onClick={() => {
                        setAlbumMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setAlbumMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={albumMenuToOpen.title}
                            CMtype={contextMenuEnum.AlbumCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </motion.div>
    )
}

export default ArtistCatalogue