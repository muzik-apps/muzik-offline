import { SquareTitleBox, GeneralContextMenu, LoaderAnimated, AddSongsToPlaylistModal } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, artist } from "@muziktypes/index";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchArtists.scss";
import { local_artists_db } from "@database/database";
import { useSearchStore } from "@store/index";
import { useNavigate } from "react-router-dom";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs } from "@utils/playerControl";

const SearchArtists = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [artistMenuToOpen, setArtistMenuToOpen] = useState<artist | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [artists, setArtists] = useState<artist[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: string, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_artist = artists.find(artist => { return artist.key === key; })
        setArtistMenuToOpen(matching_artist ? matching_artist : null);
    }

    function closeContextMenu(e?: any){
        if(e)e.preventDefault();
        setArtistMenuToOpen(null);
        setCoords({xPos: 0, yPos: 0});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowArtist && artistMenuToOpen){
            navigateTo(artistMenuToOpen.key);
        }
        else if(arg === contextMenuButtons.AddToPlaylist){ setIsPlaylistModalOpen(true); }
        else if(arg === contextMenuButtons.PlayNext && artistMenuToOpen){ 
            addTheseSongsToPlayNext({artist: artistMenuToOpen.artist_name});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.PlayLater && artistMenuToOpen){ 
            addTheseSongsToPlayLater({artist: artistMenuToOpen.artist_name});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.Play && artistMenuToOpen){
            playTheseSongs({artist: artistMenuToOpen.artist_name});
            closeContextMenu(); 
        }
    }

    function find_artist_name(key: string): string | null{
        const matching_artist = artists.find(artist => { return artist.key === key; });
        return matching_artist ? matching_artist.artist_name : null;
    }

    function navigateTo(key: string){ 
        const artist_name = find_artist_name(key);
        if(artist_name)navigate("/ArtistCatalogue/" + artist_name); 
    }

    useEffect(() => {
        const resetArtists = () => {
            setLoading(true);
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
            local_artists_db.artists.filter(item => {return regex.test(item.artist_name)}).toArray()
            .then((res) => { 
                setArtists(res);
                setLoading(false);
            });
        }

        resetArtists();
    }, [query])

    return (
        <div className="SearchArtists">
            {artists.length === 0 && loading === false && (
                <h6>no artists found that match "{query}"</h6>
            )}
            { loading && <LoaderAnimated /> }
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
                    onClick={closeContextMenu} onContextMenu={closeContextMenu}>
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={artistMenuToOpen.artist_name}
                            CMtype={contextMenuEnum.ArtistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <AddSongsToPlaylistModal 
                isOpen={isPlaylistModalOpen} 
                title={artistMenuToOpen? artistMenuToOpen.artist_name : ""} 
                values={{artist: artistMenuToOpen? artistMenuToOpen.artist_name : ""}}
                closeModal={() => setIsPlaylistModalOpen(false)} />
        </div>
    )
}

export default SearchArtists