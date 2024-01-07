import { SquareTitleBox, GeneralContextMenu, LoaderAnimated } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, genre } from "types";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchGenres.scss";
import { local_genres_db } from "@database/database";
import { useSearchStore } from "store";
import { useNavigate } from "react-router-dom";

const SearchGenres = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const [genreMenuToOpen, setGenreMenuToOpen] = useState<genre | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [genres, setGenres] = useState<genre[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_genre = genres.find(genre => { return genre.key === key; })
        setGenreMenuToOpen(matching_genre ? matching_genre : null);
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg === contextMenuButtons.AddToPlaylist){ console.log("Add to playlist"); }
        else if(arg === contextMenuButtons.PlayNext){ console.log("Play next"); }
        else if(arg === contextMenuButtons.PlayLater){ console.log("Play later"); }
        else if(arg === contextMenuButtons.Play){ console.log("Play"); }
    }
    

    function navigateTo(passed_key: number){ navigate(`/GenreView/${passed_key}`); }

    useEffect(() => {
        const resetGenres = () => {
            setLoading(true);
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
            local_genres_db.genres.filter(item => {return regex.test(item.title)}).toArray()
            .then((res) => { 
                setGenres(res);
                setLoading(false);
            });
        }

        resetGenres();
    }, [query])

    return (
        <div className="SearchGenres">
            {genres.length === 0 && loading === false && (
                <h6>no genres found that match "{query}"</h6>
            )}
            { loading && <LoaderAnimated /> }
            <div className="SearchGenres-container">
                    {genres.map((genre) =>
                        <SquareTitleBox 
                        key={genre.key}
                        cover={genre.cover} 
                        title={genre.title}
                        keyV={genre.key}
                        navigateTo={navigateTo}
                        setMenuOpenData={setMenuOpenData}/>
                    )}
            </div>
            {
                genreMenuToOpen && (
                    <div className="SearchGenres-ContextMenu-container" 
                    onClick={() => {
                        setGenreMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }} 
                    onContextMenu={(e) => {
                        e.preventDefault();
                        setGenreMenuToOpen(null);
                        setCoords({xPos: 0, yPos: 0});
                    }}
                    >
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={genreMenuToOpen.title}
                            CMtype={contextMenuEnum.GenreCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </div>
    )
}

export default SearchGenres