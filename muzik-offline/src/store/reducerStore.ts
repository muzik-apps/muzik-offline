import { PlaylistViewInterface, SearchSongInterface } from './reducerTypes';
import { Action, AlbumDetailsInterface, AllAlbumsInterface, AllTracksStateInterface,
    AllArtistsInterface, 
    reducerType, 
    AllGenresInterface,
    AllPlaylistsInterface,
    ArtistCatalogueInterface,
    GenreViewInterface} from "./reducerTypes";

export const AllTracksState: AllTracksStateInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    sort: {aToz: "Ascending", by: "name"},
    openedDDM: null,
    SongList: [],
    songMenuToOpen: null,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
};

export const alltracksReducer = (state: AllTracksStateInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SORT: return { ...state, sort: action.payload };
        case reducerType.SET_OPENED_DDM: return { ...state, openedDDM: action.payload };
        case reducerType.SET_SONG_LIST: return { ...state, SongList: action.payload };
        case reducerType.SET_SONG_MENU: return { ...state, songMenuToOpen: action.payload };
        case reducerType.SET_PLAYLIST_MODAL: return { ...state, isPlaylistModalOpen: action.payload };
        case reducerType.SET_PROPERTIES_MODAL: return { ...state, isPropertiesModalOpen: action.payload };
        default: return state;
    }
};

export const SearchSongsState: SearchSongInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    SongList: [],
    songMenuToOpen: null,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
};

export const searchSongsReducer = (state: SearchSongInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SONG_LIST: return { ...state, SongList: action.payload };
        case reducerType.SET_SONG_MENU: return { ...state, songMenuToOpen: action.payload };
        case reducerType.SET_PLAYLIST_MODAL: return { ...state, isPlaylistModalOpen: action.payload };
        case reducerType.SET_PROPERTIES_MODAL: return { ...state, isPropertiesModalOpen: action.payload };
        default: return state;
    }
};

export const AlbumDetailsState: AlbumDetailsInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    SongList: [],
    album_metadata: {cover: null,title: "",artist: "",year: "",song_count: 0,length: ""},
    songMenuToOpen: null,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
    resizeHeader: false,
};

export const albumDetailsReducer = (state: AlbumDetailsInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SONG_LIST: return { ...state, SongList: action.payload };
        case reducerType.SET_ALBUM_METADATA: return { ...state, album_metadata: action.payload };
        case reducerType.SET_SONG_MENU: return { ...state, songMenuToOpen: action.payload };
        case reducerType.SET_PLAYLIST_MODAL: return { ...state, isPlaylistModalOpen: action.payload };
        case reducerType.SET_PROPERTIES_MODAL: return { ...state, isPropertiesModalOpen: action.payload };
        case reducerType.SET_RESIZE_HEADER: return { ...state, resizeHeader: action.payload };
        default: return state;
    }
};

export const AllAlbumsState: AllAlbumsInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    sort: {aToz: "Ascending", by: "name"},
    openedDDM: null,
    albumList: [],
    albumMenuToOpen: null,
};

export const allAlbumsReducer = (state: AllAlbumsInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SORT: return { ...state, sort: action.payload };
        case reducerType.SET_OPENED_DDM: return { ...state, openedDDM: action.payload };
        case reducerType.SET_ALBUM_LIST: return { ...state, albumList: action.payload };
        case reducerType.SET_ALBUM_MENU: return { ...state, albumMenuToOpen: action.payload };
        default: return state;
    }
};

export const ArtistCatalogueState: ArtistCatalogueInterface = {
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    albumList: [],
    albumMenuToOpen: null,
    artist_metadata: {cover: null,artistName: "",album_count: 0,song_count: 0,length: ""},
    resizeHeader: false,
};

export const artistCatalogueReducer = (state: ArtistCatalogueInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_ALBUM_MENU: return { ...state, albumMenuToOpen: action.payload };
        case reducerType.SET_ARTIST_METADATA: return { ...state, artist_metadata: action.payload };
        case reducerType.SET_ALBUM_LIST: return { ...state, albumList: action.payload };
        case reducerType.SET_RESIZE_HEADER: return { ...state, resizeHeader: action.payload };
        default: return state;
    }
};

export const AllArtistsState: AllArtistsInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    sort: {aToz: "Ascending", by: "name"},
    openedDDM: null,
    artistList: [],
    artistMenuToOpen: null,
};

export const allArtistsReducer = (state: AllArtistsInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SORT: return { ...state, sort: action.payload };
        case reducerType.SET_OPENED_DDM: return { ...state, openedDDM: action.payload };
        case reducerType.SET_ARTIST_LIST: return { ...state, artistList: action.payload };
        case reducerType.SET_ARTIST_MENU: return { ...state, artistMenuToOpen: action.payload };
        default: return state;
    }
};

export const GenreViewState: GenreViewInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    SongList: [],
    genre_metadata: {cover: null,genreName: "",song_count: 0,length: ""},
    songMenuToOpen: null,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
    resizeHeader: false,
};

export const genreViewReducer = (state: GenreViewInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SONG_LIST: return { ...state, SongList: action.payload };
        case reducerType.SET_GENRE_METADATA: return { ...state, genre_metadata: action.payload };
        case reducerType.SET_SONG_MENU: return { ...state, songMenuToOpen: action.payload };
        case reducerType.SET_PLAYLIST_MODAL: return { ...state, isPlaylistModalOpen: action.payload };
        case reducerType.SET_PROPERTIES_MODAL: return { ...state, isPropertiesModalOpen: action.payload };
        case reducerType.SET_RESIZE_HEADER: return { ...state, resizeHeader: action.payload };
        default: return state;
    }
};

export const AllGenresState: AllGenresInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    sort: {aToz: "Ascending", by: "name"},
    openedDDM: null,
    genreList: [],
    genreMenuToOpen: null,
};

export const allGenreReducer = (state: AllGenresInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SORT: return { ...state, sort: action.payload };
        case reducerType.SET_OPENED_DDM: return { ...state, openedDDM: action.payload };
        case reducerType.SET_GENRE_LIST: return { ...state, genreList: action.payload };
        case reducerType.SET_GENRE_MENU: return { ...state, genreMenuToOpen: action.payload };
        default: return state;
    }
};

export const PlaylistViewState: PlaylistViewInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    SongList: [],
    playlist_metadata: {key: 0,cover: null,playlistName: "",song_count: 0,length: ""},
    songMenuToOpen: null,
    isEditingPlayListModalOpen: false,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
    resizeHeader: false,
};

export const playlistViewReducer = (state: PlaylistViewInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SONG_LIST: return { ...state, SongList: action.payload };
        case reducerType.SET_PLAYLIST_METADATA: return { ...state, playlist_metadata: action.payload };
        case reducerType.SET_SONG_MENU: return { ...state, songMenuToOpen: action.payload };
        case reducerType.SET_EDIT_PLAYLIST_MODAL: return { ...state, isEditingPlayListModalOpen: action.payload };
        case reducerType.SET_PLAYLIST_MODAL: return { ...state, isPlaylistModalOpen: action.payload };
        case reducerType.SET_PROPERTIES_MODAL: return { ...state, isPropertiesModalOpen: action.payload };
        case reducerType.SET_RESIZE_HEADER: return { ...state, resizeHeader: action.payload };
        default: return state;
    }
};

export const AllPlaylistsState: AllPlaylistsInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    sort: {aToz: "Ascending", by: "name"},
    openedDDM: null,
    playlistList: [],
    playlistMenuToOpen: null,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
};

export const allPlaylistsReducer = (state: AllPlaylistsInterface, action: Action) => {
    switch (action.type) {
        case reducerType.SET_LOADING: return { ...state, isloading: action.payload };
        case reducerType.SET_SELECTED: return { ...state, selected: action.payload };
        case reducerType.SET_COORDS: return { ...state, co_ords: action.payload };
        case reducerType.SET_SORT: return { ...state, sort: action.payload };
        case reducerType.SET_OPENED_DDM: return { ...state, openedDDM: action.payload };
        case reducerType.SET_PLAYLIST_LIST: return { ...state, playlistList: action.payload };
        case reducerType.SET_PLAYLIST_MENU: return { ...state, playlistMenuToOpen: action.payload };
        case reducerType.SET_PLAYLIST_MODAL: return { ...state, isPlaylistModalOpen: action.payload };
        case reducerType.SET_PROPERTIES_MODAL: return { ...state, isPropertiesModalOpen: action.payload };
        default: return state;
    }
};