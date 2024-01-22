import { SquareTitleBox, GeneralContextMenu, LoaderAnimated, AddSongsToPlaylistModal, PropertiesModal } from "@components/index";
import { playlist, mouse_coOrds, contextMenuEnum, contextMenuButtons } from "@muziktypes/index";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchPlaylists.scss";
import { local_playlists_db } from "@database/database";
import { useSearchStore } from "@store/index";
import { useNavigate } from "react-router-dom";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs } from "@utils/playerControl";

const SearchPlaylists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [isPropertiesModalOpen, setIsPropertiesModalOpen] = useState<boolean>(false);
    const [playlistMenuToOpen, setPlaylistMenuToOpen] = useState<playlist | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [playlists, setPlaylists] = useState<playlist[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_playlist = playlists.find(playlist => { return playlist.key === Number.parseInt(key); })
        setPlaylistMenuToOpen(matching_playlist ? matching_playlist : null);
    }

    function closeContextMenu(e?: any){
        if(e)e.preventDefault();
        setPlaylistMenuToOpen(null);
        setCoords({xPos: 0, yPos: 0});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowPlaylist && playlistMenuToOpen)navigateTo(playlistMenuToOpen.key.toString());
        else if(arg === contextMenuButtons.ShowInfo){ setIsPropertiesModalOpen(true); }
        else if(arg === contextMenuButtons.AddToPlaylist){ setIsPlaylistModalOpen(true); }
        else if(arg === contextMenuButtons.PlayNext && playlistMenuToOpen){ 
            addTheseSongsToPlayNext({playlist: playlistMenuToOpen.title});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.PlayLater && playlistMenuToOpen){ 
            addTheseSongsToPlayLater({playlist: playlistMenuToOpen.title});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.Play && playlistMenuToOpen){
            playTheseSongs({playlist: playlistMenuToOpen.title});
            closeContextMenu(); 
        }
    }

    function navigateTo(passed_key: string){ navigate(`/PlaylistView/${passed_key}`); }

    useEffect(() => {
        const resetPlaylists = () => {
            setLoading(true);
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
            local_playlists_db.playlists.filter(item => {return regex.test(item.title)}).toArray()
            .then((res) => { 
                setPlaylists(res);
                setLoading(false);
            });
        }

        resetPlaylists();
    }, [query])

    return (
        <div className="SearchPlaylists">
            {playlists.length === 0 && loading === false && (
                <h6>no playlists found that match "{query}"</h6>
            )}
            { loading && <LoaderAnimated /> }
            <div className="SearchPlaylists-container">
                    {playlists.map((playlist) => 
                        <SquareTitleBox 
                        key={playlist.key}
                        cover={playlist.cover} 
                        title={playlist.title}
                        keyV={playlist.key.toString()}
                        navigateTo={navigateTo}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
            </div>
            {
                playlistMenuToOpen && (
                    <div className="SearchPlaylists-ContextMenu-container" 
                    onClick={() => {
                        setPlaylistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setPlaylistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={playlistMenuToOpen.title}
                            CMtype={contextMenuEnum.PlaylistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <PropertiesModal isOpen={isPropertiesModalOpen} playlist={playlistMenuToOpen ? playlistMenuToOpen : undefined} closeModal={() => setIsPropertiesModalOpen(false)}/>
            <AddSongsToPlaylistModal 
                isOpen={isPlaylistModalOpen} 
                title={playlistMenuToOpen? playlistMenuToOpen.title : ""} 
                values={{playlist: playlistMenuToOpen? playlistMenuToOpen.title : ""}}
                closeModal={() => setIsPlaylistModalOpen(false)} />
        </div>
    )
}

export default SearchPlaylists