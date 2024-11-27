import { SquareTitleBox, GeneralContextMenu, AddSongsToPlaylistModal } from "@components/index";
import { mouse_coOrds, contextMenuEnum, contextMenuButtons, genre } from "@muziktypes/index";
import { useEffect, useState } from "react";
import "@styles/layouts/SearchGenres.scss";
import { local_genres_db } from "@database/database";
import { useSearchStore } from "@store/index";
import { useNavigate } from "react-router-dom";
import { addTheseSongsToPlayNext, addTheseSongsToPlayLater, playTheseSongs } from "@utils/playerControl";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SearchGenres = () => {
    const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
    const [loading, setLoading] = useState<boolean>(false);
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
    const [genreMenuToOpen, setGenreMenuToOpen] = useState<genre | null>(null);
    const { query } = useSearchStore((state) => { return { query: state.query}; });
    const [genres, setGenres] = useState<genre[]>([]);
    const navigate = useNavigate();

    function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
        setCoords(n_co_ords);
        const matching_genre = genres.find(genre => { return genre.key === key; })
        setGenreMenuToOpen(matching_genre ? matching_genre : null);
    }

    function closeContextMenu(e?: any){
        if(e)e.preventDefault();
        setGenreMenuToOpen(null);
        setCoords({xPos: 0, yPos: 0});
    }

    function chooseOption(arg: contextMenuButtons){
        if(arg == contextMenuButtons.ShowGenre && genreMenuToOpen){
            navigateTo(genreMenuToOpen.key);
        }
        else if(arg === contextMenuButtons.AddToPlaylist){ setIsPlaylistModalOpen(true); }
        else if(arg === contextMenuButtons.PlayNext && genreMenuToOpen){ 
            addTheseSongsToPlayNext({genre: genreMenuToOpen.title});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.PlayLater && genreMenuToOpen){ 
            addTheseSongsToPlayLater({genre: genreMenuToOpen.title});
            closeContextMenu(); 
        }
        else if(arg === contextMenuButtons.Play && genreMenuToOpen){
            playTheseSongs({genre: genreMenuToOpen.title});
            closeContextMenu(); 
        }
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
            { loading &&
                <div className="skeleton-loading">
                    <SkeletonTheme baseColor="#b6b6b633" highlightColor="#00000005" duration={2}>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                        <Skeleton count={1} className="skeleton-object"/>
                    </SkeletonTheme> 
                </div>}
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
                    <div className="bottom_margin"/>
            </div>
            {
                genreMenuToOpen && co_ords.xPos !== 0 && co_ords.yPos !== 0 && (
                    <div className="SearchGenres-ContextMenu-container"
                    onClick={closeContextMenu} onContextMenu={closeContextMenu}>
                        <GeneralContextMenu 
                            xPos={co_ords.xPos} 
                            yPos={co_ords.yPos} 
                            title={genreMenuToOpen.title}
                            CMtype={contextMenuEnum.GenreCM}
                            chooseOption={chooseOption}/>
                    </div>
                )
            }
            <AddSongsToPlaylistModal 
                isOpen={isPlaylistModalOpen} 
                title={genreMenuToOpen? genreMenuToOpen.title : ""} 
                values={{genre: genreMenuToOpen? genreMenuToOpen.title : ""}}
                closeModal={() => {
                    setIsPlaylistModalOpen(false);
                    closeContextMenu();
                }} />
        </div>
    )
}

export default SearchGenres