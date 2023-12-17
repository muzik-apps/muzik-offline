import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, album } from "types";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchAlbums.scss";
import { local_albums_db } from "@database/database";
import { useSearchStore } from "store";
import { useNavigate } from "react-router-dom";

const SearchAlbums = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [albumMenuToOpen, setAlbumMenuToOpen] = useState<album | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [albums, setAlbums] = useState<album[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_album = albums.find(album => { return album.key === key; });
        setAlbumMenuToOpen(matching_album ? matching_album : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    function navigateTo(key: number){ navigate("/AlbumDetails/" + key); }

    useEffect(() => {
        const resetAlbums = () => {
            local_albums_db.albums.where("title").startsWithIgnoreCase(query).toArray().then((res) => { setAlbums(res);});
        }

        resetAlbums();
    }, [query])

    return (
        <div className="SearchAlbums">
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
            </div>
            {
                albumMenuToOpen && (
                    <div className="SearchAlbums-ContextMenu-container" 
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
                            CMtype={contextMenuEnum.PlaylistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </div>
    )
}

export default SearchAlbums