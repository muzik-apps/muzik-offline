import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, genre } from "types";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchGenres.scss";
import { local_genres_db } from "@database/database";
import { useSearchStore } from "store";

const SearchGenres = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [genreMenuToOpen, setGenreMenuToOpen] = useState<genre | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [genres, setGenres] = useState<genre[]>([]);

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_genre = genres.find(genre => { return genre.key === key; })
        setGenreMenuToOpen(matching_genre ? matching_genre : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    function navigateTo(key: number){
        console.log("Navigate to genre with key: " + key);
    }

    useEffect(() => {
        const resetGenres = () => {
            local_genres_db.genres.where("title").startsWithIgnoreCase(query).toArray().then((res) => { setGenres(res);});
        }

        resetGenres();
    }, [query])

    return (
        <div className="SearchGenres">
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
                            CMtype={contextMenuEnum.PlaylistCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
        </div>
    )
}

export default SearchGenres