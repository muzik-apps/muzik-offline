import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, artist } from "types";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchArtists.scss";
import { local_artists_db } from "@database/database";
import { useSearchStore } from "store";
import { useNavigate } from "react-router-dom";

const SearchArtists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [artistMenuToOpen, setArtistMenuToOpen] = useState<artist | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [artists, setArtists] = useState<artist[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_artist = artists.find(artist => { return artist.key === key; })
        setArtistMenuToOpen(matching_artist ? matching_artist : null);
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowArtist && artistMenuToOpen){
            navigateTo(artistMenuToOpen.key);
        }
    }

    function navigateTo(key: number){ navigate("/ArtistCatalogue/" + artists[key].artist_name); }

    useEffect(() => {
        const resetArtists = () => {
            local_artists_db.artists.where("artist_name").startsWithIgnoreCase(query).toArray().then((res) => { setArtists(res);});
        }

        resetArtists();
    }, [query])

    return (
        <div className="SearchArtists">
            <div className="SearchArtists-container">
                    {artists.map((artist) => 
                        <SquareTitleBox 
                        key={artist.key}
                        cover={artist.cover} 
                        title={artist.artist_name}
                        keyV={artist.key}
                        navigateTo={navigateTo}
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