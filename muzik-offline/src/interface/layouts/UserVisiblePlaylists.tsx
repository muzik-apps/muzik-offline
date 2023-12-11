import { playlist1, playlist2, playlist3, playlist4, playlist5, playlist6, playlist7, playlist8 } from "@assets/index";
import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { playlistDetails, mouse_coOrds, contextMenuEnum } from "types";
import { useState } from "react";
import "@styles/layouts/UserVisiblePlaylists.scss";

const playlists: playlistDetails[] = [
    {
        key: 1,
        cover: playlist1,
        title: "playlist 1",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 2,
        cover: playlist2,
        title: "playlist 2",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 3,
        cover: playlist3,
        title: "playlist 3",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 4,
        cover: playlist4,
        title: "playlist 4",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 5,
        cover: playlist5,
        title: "playlist 5",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 6,
        cover: playlist6,
        title: "playlist 6",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 7,
        cover: playlist7,
        title: "playlist 7",
        dateCreated: new Date().toUTCString()
    },
    {
        key: 8,
        cover: playlist8,
        title: "playlist 8",
        dateCreated: new Date().toUTCString()
    }
]

const UserVisiblePlaylists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [playlistMenuToOpen, setPlaylistMenuToOpen] = useState<playlistDetails | null>(null);

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_playlist = playlists.find(playlist => { return playlist.key === key; })
        setPlaylistMenuToOpen(matching_playlist ? matching_playlist : null);
    }

    return (
        <div className="UserVisiblePlaylists">
            <div className="UserVisiblePlaylists-container">
                {playlists.map((playlist) => 
                        <SquareTitleBox 
                            key={playlist.key}
                            cover={playlist.cover} 
                            title={playlist.title}
                            keyV={playlist.key}
                            setMenuOpenData={setMenuOpenData}
                        />)}
            </div>
            {
                playlistMenuToOpen && (
                    <div className="UserVisiblePlaylists-ContextMenu-container" 
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
                            CMtype={contextMenuEnum.PlaylistCM}/>
                    </div>
                )
            }
        </div>
    )
}

export default UserVisiblePlaylists