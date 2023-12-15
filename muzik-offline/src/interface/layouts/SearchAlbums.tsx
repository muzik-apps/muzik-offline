import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, Song, album } from "types";
import { useState,  useRef, useEffect } from "react";
import "@styles/layouts/SearchAlbums.scss";
import useLocalStorageState from "use-local-storage-state";

const SearchAlbums = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [albumMenuToOpen, setAlbumMenuToOpen] = useState<album | null>(null);
    const [albums, setAlbums] = useState<album[]>([]);
    const [SongList,] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});
    const albumsLoaded = useRef<boolean>(false);

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_album = albums.find(album => { return album.key === key; });
        setAlbumMenuToOpen(matching_album ? matching_album : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    useEffect(() => {
        const findAlbums = () => {
            if(albumsLoaded.current === true)return;
            if(SongList.length === 0)return;
            albumsLoaded.current = true;
            const uniqueSet: Set<string> = new Set();
            const albums_list = SongList.map((song) => {
                if (!uniqueSet.has(song.album)) {
                    uniqueSet.add(song.album);
                    return song.album;
                }
                return null; // Returning null for elements that are not added to the uniqueArray
            }).filter((element) => {
                return element !== null; // Filtering out elements that were not added to the uniqueArray
            });

            albums_list.map((album_str, index) => { 
                if(album_str !== null)setAlbums(oldArray => [...oldArray, { key: index, cover: null, title: album_str}]);
            });
        }
        
        findAlbums();
    }, [SongList])

    return (
        <div className="SearchAlbums">
            <div className="SearchAlbums-container">
                    {albums.map((album) => 
                        <SquareTitleBox 
                        key={album.key}
                        cover={album.cover} 
                        title={album.title}
                        keyV={album.key}
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