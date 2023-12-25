import { RectangleSongBox, GeneralContextMenu, AddSongToPlaylistModal, PropertiesModal } from "@components/index";
import { mouse_coOrds, contextMenuEnum, Song, contextMenuButtons } from "types";
import { useState, useRef, useEffect } from "react";
import "@styles/layouts/SearchSongs.scss";
import { ViewportList } from 'react-viewport-list';
import { local_albums_db, local_songs_db } from "@database/database";
import { useSearchStore } from "store";
import { useNavigate } from "react-router-dom";

const SearchSongs = () => {
    const [selected, setSelectedSong] = useState<number>(0);
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [songMenuToOpen, setSongMenuToOpen] = useState< Song | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [SongList, setSongLists] = useState<Song[]>([]);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement | null>(null);

    function selectThisSong(index: number){ setSelectedSong(index); }

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_song = SongList.find(song => { return song.id === key; })
        setSongMenuToOpen(matching_song ? matching_song : null);
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.ShowInfo){ setIsPropertiesModalOpen(true);}
        else if(arg === contextMenuButtons.AddToPlaylist){ setIsPlaylistModalOpen(true); }
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
        const resetSongLists = () => {
            local_songs_db.songs.where("name").startsWithIgnoreCase(query).toArray().then((res) => { setSongLists(res);});
        }

        resetSongLists();
    }, [query])

    return (
        <div className="SearchSongs">
            <div className="SearchSongs-container" ref={ref}>
                <ViewportList viewportRef={ref} items={SongList}>
                    {(song, index) => (
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
                    )}
                </ViewportList>
                <div className="AllTracks_container_bottom_margin"/>
            </div>
            {
                songMenuToOpen && (
                    <div className="SearchSongs-ContextMenu-container" 
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
            <PropertiesModal isOpen={isPropertiesModalOpen} song={songMenuToOpen!} closeModal={() => {setIsPropertiesModalOpen(false); setSongMenuToOpen(null);}} />
            <AddSongToPlaylistModal 
                isOpen={isPlaylistModalOpen} 
                songPath={songMenuToOpen ? songMenuToOpen.path : ""} 
                closeModal={() => setIsPlaylistModalOpen(false)} />
        </div>
    )
}

export default SearchSongs