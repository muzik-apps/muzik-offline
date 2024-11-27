import { SquareTitleBox, GeneralContextMenu, AddSongsToPlaylistModal } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, album } from "@muziktypes/index";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchAlbums.scss";
import { local_albums_db } from "@database/database";
import { useSearchStore } from "@store/index";
import { useNavigate } from "react-router-dom";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs } from "@utils/playerControl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const SearchAlbums = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [albumMenuToOpen, setAlbumMenuToOpen] = useState<album | null>(null);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [albums, setAlbums] = useState<album[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_album = albums.find(album => { return album.key === key; });
        setAlbumMenuToOpen(matching_album ? matching_album : null);
    }

    function closeContextMenu(e?: any){
        if(e)e.preventDefault();
        setAlbumMenuToOpen(null);
        setCoords({xPos: 0, yPos: 0});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowAlbum && albumMenuToOpen){
            navigateTo(albumMenuToOpen.key);
        }
        else if(arg === contextMenuButtons.AddToPlaylist){ setIsPlaylistModalOpen(true); }
        else if(arg === contextMenuButtons.PlayNext && albumMenuToOpen){ 
            addTheseSongsToPlayNext({album: albumMenuToOpen.title});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.PlayLater && albumMenuToOpen){ 
            addTheseSongsToPlayLater({album: albumMenuToOpen.title});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.Play && albumMenuToOpen){
            playTheseSongs({album: albumMenuToOpen.title});
            closeContextMenu(); 
        }
    }

    function navigateTo(key: number){ navigate(`/AlbumDetails/${key}/undefined`); }

    useEffect(() => {
        const resetAlbums = () => {
            setLoading(true);
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
            local_albums_db.albums.filter(item => {return regex.test(item.title)}).toArray()
            .then((res) => { 
                setAlbums(res);
                setLoading(false);
            });
        }

        resetAlbums();
    }, [query])

    return (
        <div className="SearchAlbums">
            {albums.length === 0 && loading === false && (
                <h6>no albums found that match "{query}"</h6>
            )}
            { loading &&
                <div className="skeleton-loading">
                    <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" duration={2}>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                    </SkeletonTheme>
                </div>}
            <div className="SearchAlbums-container">
                    {albums.map((album) => 
                        <SquareTitleBox 
                        key={album.key}
                        cover={album.cover} 
                        title={album.title}
                        keyV={album.key}
                        navigateTo={navigateTo}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
                    <div className="bottom_margin"/>
            </div>
            
            {
                albumMenuToOpen && co_ords.xPos !== 0 && co_ords.yPos !== 0 && (
                    <div className="SearchAlbums-ContextMenu-container" 
                    onClick={closeContextMenu} onContextMenu={closeContextMenu}>
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={albumMenuToOpen.title}
                            CMtype={contextMenuEnum.AlbumCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <AddSongsToPlaylistModal 
                isOpen={isPlaylistModalOpen} 
                title={albumMenuToOpen? albumMenuToOpen.title : ""} 
                values={{album: albumMenuToOpen? albumMenuToOpen.title : ""}}
                closeModal={() => {
                    setIsPlaylistModalOpen(false);
                    closeContextMenu();
                }} />
        </div>
    )
}

export default SearchAlbums