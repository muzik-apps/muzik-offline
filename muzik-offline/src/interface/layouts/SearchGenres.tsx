import { SquareTitleBox, GeneralContextMenu } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, Song, genre } from "types";
import { useState,useEffect, useRef } from "react";
import "@styles/layouts/SearchGenres.scss";
import useLocalStorageState from "use-local-storage-state";

const SearchGenres = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [genreMenuToOpen, setGenreMenuToOpen] = useState<genre | null>(null);
    const [genres, setGenres] = useState<genre[]>([]);
    const [SongList,] = useLocalStorageState<Song[]>("SongList", {defaultValue: []});

    const genresLoaded = useRef<boolean>(false);

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_genre = genres.find(genre => { return genre.key === key; })
        setGenreMenuToOpen(matching_genre ? matching_genre : null);
    }

    function chooseOption(arg: contextMenuButtons){
    
    }

    useEffect(() => {
        const findGenre = () => {
            if(genresLoaded.current === true)return;
            if(SongList.length === 0)return;
            genresLoaded.current = true;
            const uniqueSet: Set<string> = new Set();
            const genres_list = SongList.map((song) => {
                if (!uniqueSet.has(song.genre)) {
                    uniqueSet.add(song.genre);
                    return song.genre;
                }
                return null; // Returning null for elements that are not added to the uniqueArray
            }).filter((element) => {
                return element !== null; // Filtering out elements that were not added to the uniqueArray
            });

            genres_list.map((genre_str, index) => { 
                if(genre_str !== null)setGenres(oldArray => [...oldArray, { key: index, cover: null, title: genre_str}]);
            });
        }
        
        findGenre();
    }, [SongList])

    return (
        <div className="SearchGenres">
            <div className="SearchGenres-container">
                    {genres.map((genre) =>
                        <SquareTitleBox 
                        key={genre.key}
                        cover={genre.cover} 
                        title={genre.title}
                        keyV={genre.key}
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