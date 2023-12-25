import { Action, AllTracksStateInterface, reducerType } from "./reducerTypes";

export const AllTracksState: AllTracksStateInterface = {
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