import { Edit, Play, Shuffle } from "@assets/icons";
import { LargeResizableCover, RectangleSongBox, GeneralContextMenu, EditPlaylistModal, PropertiesModal } from "@components/index";
import { local_albums_db, local_playlists_db } from "@database/database";
import { mouse_coOrds, Song, contextMenuButtons, contextMenuEnum } from "types";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPlaylistSongs, secondsToTimeFormat } from "utils";
import "@styles/pages/PlaylistView.scss";
import { ViewportList } from "react-viewport-list";

interface PlaylistMD {key: number;cover: string | null;playlistName: string;song_count: number;length: string;}

const emptyMD: PlaylistMD = {key: 0,cover: null,playlistName: "",song_count: 0,length: ""}

const variants_list = {smaller: { height: "calc(100vh - 395px)" },bigger: { height: "calc(100vh - 195px)" }}

const PlaylistView = () => {
    const [selected, setSelected] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [SongList, setSongList] = useState<Song[]>([]);
    const [playlist_metadata, setPlaylistMetadata] = useState<PlaylistMD>(emptyMD);
    const [songMenuToOpen, setSongMenuToOpen] = useState<Song | null>(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    
    const [resizeHeader, setResizeHeader] = useState<boolean>(false);
    const itemsHeightRef = useRef<HTMLDivElement | null>(null);
    const { playlist_key } = useParams(); 

    function selectThisSong(index: number){ setSelected(index); }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongList.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    function handleScroll(){
        const scrollY = itemsHeightRef.current?.scrollTop ?? 0;
        // NOTE: The following console.log might affect the timing of the code execution.
        // If you experience issues with state updates, it's recommended to investigate
        // potential asynchronous behavior and consider removing or adjusting this log.
        console.log;
        if(scrollY === 0)setResizeHeader(false);
        else if(resizeHeader === false)setResizeHeader(true);
    };

    async function setPlaylistSongs(){
        if(playlist_key === undefined)return;
        const playlistres = await local_playlists_db.playlists.where("key").equals(Number.parseInt(playlist_key)).toArray();
        if(playlistres.length !== 1)return;
        const result = await getPlaylistSongs(playlistres[0]);
        setPlaylistMetadata({
            key: playlistres[0].key,
            cover: playlistres[0].cover, playlistName: playlistres[0].title,
            song_count: result.songs.length,
            length: secondsToTimeFormat(result.totalDuration)
        });
        setSongList(result.songs);
    }

    async function closePlaylistModal(){
        setIsPlaylistModalOpen(false);
        //get this playlist
        const pl = await local_playlists_db.playlists.where("key").equals(playlist_metadata.key).toArray();
        setPlaylistMetadata({key: pl[0].key,cover: pl[0].cover, playlistName: pl[0].title,song_count: playlist_metadata.song_count,length: playlist_metadata.length});
    }

    async function navigateTo(key: number, type: "artist" | "song"){
        const relatedSong = SongList.find((value) => value.id === key);
        if(!relatedSong)return;
        if(type === "song"){
            const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).toArray();
            navigate(`/AlbumDetails/${albumres[0].key}/undefined`);
        }
        else if(type === "artist"){
            navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        }
    }

    useEffect(() => {
        setPlaylistSongs();
        itemsHeightRef.current?.addEventListener('scroll', handleScroll);
        return () =>  itemsHeightRef.current?.removeEventListener('scroll', handleScroll);
    }, [])

    return (
        <motion.div className="PlaylistView"
        initial={{scale: 0.9, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.9, opacity: 0}}>
            <div className="header_content">
                <LargeResizableCover id={playlist_key} resizeHeader={resizeHeader} cover={playlist_metadata.cover} />
                <div className="details">
                    <h2 style={{ marginTop: resizeHeader ? "25px" : "68px" }}>{playlist_metadata.playlistName}</h2>
                    { !resizeHeader &&
                        <>
                            <h4>{playlist_metadata.song_count} songs</h4>
                            <div className="action_buttons">
                                <motion.div className="PlayIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Play /><p>play</p>
                                </motion.div>
                                <motion.div className="ShuffleIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}}>
                                    <Shuffle /><p>Shuffle</p>
                                </motion.div>
                                <motion.div className="EditIcon" whileHover={{scale: 1.02}} whileTap={{scale: 0.98}} onClick={() => setIsPlaylistModalOpen(true)}>
                                    <Edit /><p>Edit</p>
                                </motion.div>
                            </div>
                        </>
                    }
                </div>
            </div>
            <motion.div className="main_content" 
                animate={resizeHeader ? "bigger" : "smaller"}
                variants={variants_list}
                transition={{ type: "tween" }}
                ref={itemsHeightRef}>
                <ViewportList viewportRef={itemsHeightRef} items={SongList}>
                    {
                        (song, index) => (
                            <RectangleSongBox 
                                key={song.id}
                                keyV={song.id}
                                index={index + 1} 
                                cover={song.cover} 
                                songName={song.name} 
                                artist={song.artist}
                                length={song.duration} 
                                year={song.year}
                                selected={selected === index + 1 ? true : false}
                                selectThisSong={selectThisSong}
                                setMenuOpenData={setMenuOpenData}
                                navigateTo={navigateTo}
                                playThisSong={(_key: number,) => {}}/>
                        )
                    }
                </ViewportList>
                <div className="footer_content">
                    <h4>{playlist_metadata.song_count} {playlist_metadata.song_count > 1 ? "Songs" : "Song"}, {playlist_metadata.length} listen time</h4>
                </div>
            </motion.div>
            {
                songMenuToOpen && (
                    <div className="PlaylistView-ContextMenu-container" 
                    onClick={() => {
                        setSongMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setSongMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={songMenuToOpen.name}
                            CMtype={contextMenuEnum.SongCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <EditPlaylistModal 
                playlistobj={{key: playlist_metadata.key, cover: playlist_metadata.cover, title: playlist_metadata.playlistName, dateCreated: "", dateEdited: "", tracksPaths: []}}
                isOpen={isPlaylistModalOpen} 
                closeModal={closePlaylistModal}/>
            <PropertiesModal isOpen={isPropertiesModalOpen} song={songMenuToOpen ? songMenuToOpen : undefined} closeModal={() => setIsPropertiesModalOpen(false)} />
        </motion.div>
    )
}

export default PlaylistView