import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, artist, Song } from "types";
import { useState, useEffect, useRef } from "react";
import "@styles/layouts/SearchArtists.scss";
import useLocalStorageState from "use-local-storage-state";

const SearchArtists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [artistMenuToOpen, setArtistMenuToOpen] = useState<artist | null>(null);
    const [artists, setArtists] = useState<artist[]>([]);
    const [SongList,] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});

    const artistsLoaded = useRef<boolean>(false);

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_artist = artists.find(artist => { return artist.key === key; })
        setArtistMenuToOpen(matching_artist ? matching_artist : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    useEffect(() => {
        const findArtist = () => {
            if(artistsLoaded.current === true)return;
            if(SongList.length === 0)return;
            artistsLoaded.current = true;
            const uniqueSet: Set<string> = new Set();
            const artists_list = SongList.map((song) => {
                if (!uniqueSet.has(song.artist)) {
                    uniqueSet.add(song.artist);
                    return song.artist;
                }
                return null; // Returning null for elements that are not added to the uniqueArray
            }).filter((element) => {
                return element !== null; // Filtering out elements that were not added to the uniqueArray
            });

            artists_list.map((artist_str, index) => { 
                if(artist_str !== null)setArtists(oldArray => [...oldArray, { key: index, cover: null, artist_name: artist_str}]);
            });
        }
        
        findArtist();
    }, [SongList])

    return (
        <div className="SearchArtists">
            <div className="SearchArtists-container">
                    {artists.map((artist) => 
                        <SquareTitleBox 
                        key={artist.key}
                        cover={artist.cover} 
                        title={artist.artist_name}
                        keyV={artist.key}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
            </div>
            {
                artistMenuToOpen && (
                    <div className="SearchArtists-ContextMenu-container" 
                    onClick={() => {
                        setArtistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setArtistMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={artistMenuToOpen.artist_name}
                            CMtype={contextMenuEnum.PlaylistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </div>
    )
}

export default SearchArtists