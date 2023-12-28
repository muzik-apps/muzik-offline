import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { playlist, mouse_coOrds, contextMenuEnum, contextMenuButtons } from "types";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchPlaylists.scss";
import { local_playlists_db } from "@database/database";
import { useSearchStore } from "store";
import { useNavigate } from "react-router-dom";

const SearchPlaylists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [playlistMenuToOpen, setPlaylistMenuToOpen] = useState<playlist | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [playlists, setPlaylists] = useState<playlist[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_playlist = playlists.find(playlist => { return playlist.key === key; })
        setPlaylistMenuToOpen(matching_playlist ? matching_playlist : null);
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.AddToPlaylist){ console.log("Add to playlist"); }
        else if(arg === contextMenuButtons.PlayNext){ console.log("Play next"); }
        else if(arg === contextMenuButtons.PlayLater){ console.log("Play later"); }
        else if(arg === contextMenuButtons.Play){ console.log("Play"); }
    }

    function navigateTo(passed_key: number){ navigate(`/PlaylistView/${passed_key}`); }

    useEffect(() => {
        const resetPlaylists = () => {
            local_playlists_db.playlists.where("title").startsWithIgnoreCase(query).toArray().then((res) => { setPlaylists(res);});
        }

        resetPlaylists();
    }, [query])

    return (
        <div className="SearchPlaylists">
            <div className="SearchPlaylists-container">
                    {playlists.map((playlist) => 
                        <SquareTitleBox 
                        key={playlist.key}
                        cover={playlist.cover} 
                        title={playlist.title}
                        keyV={playlist.key}
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
        </div>
    )
}

export default SearchPlaylists