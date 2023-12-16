import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { playlist, mouse_coOrds, contextMenuEnum, contextMenuButtons } from "types";
import { useState } from "react";
import "@styles/layouts/SearchPlaylists.scss";
import { local_playlists_db } from "@database/database";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchStore } from "store";

const SearchPlaylists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [playlistMenuToOpen, setPlaylistMenuToOpen] = useState<playlist | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const playlists = useLiveQuery(() => local_playlists_db.playlists.where("title").startsWithIgnoreCase(query).toArray()) ?? [];

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_playlist = playlists.find(playlist => { return playlist.key === key; })
        setPlaylistMenuToOpen(matching_playlist ? matching_playlist : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    return (
        <div className="SearchPlaylists">
            <div className="SearchPlaylists-container">
                    {playlists.map((playlist) => 
                        <SquareTitleBox 
                        key={playlist.key}
                        cover={playlist.cover} 
                        title={playlist.title}
                        keyV={playlist.key}
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