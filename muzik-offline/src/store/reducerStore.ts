import { Action, AlbumDetailsInterface, AllAlbumsInterface, AllTracksStateInterface,
    AllArtistsInterface, 
    reducerType } from "./reducerTypes";

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

export const AlbumDetailsState: AlbumDetailsInterface = {
    isloading: true,
    selected: 0,
    co_ords: { xPos: 0, yPos: 0 },
    SongList: [],
    album_metadata: {cover: null,title: "",artist: "",year: "",song_count: 0,length: ""},
    songMenuToOpen: null,
    isPlaylistModalOpen: false,
    isPropertiesModalOpen: false,
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