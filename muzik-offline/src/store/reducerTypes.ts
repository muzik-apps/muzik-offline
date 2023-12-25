import { Song, mouse_coOrds } from "types";

export enum reducerType {
    SET_SELECTED = "SET_SELECTED",
    SET_COORDS = "SET_COORDS",
    SET_SORT = "SET_SORT",
    SET_OPENED_DDM = "SET_OPENED_DDM",
    SET_SONG_LIST = "SET_SONG_LIST",
    SET_SONG_MENU = "SET_SONG_MENU",
    SET_PLAYLIST_MODAL = "SET_PLAYLIST_MODAL",
    SET_PROPERTIES_MODAL = "SET_PROPERTIES_MODAL",

}

export type Action =
    | { type: reducerType.SET_SELECTED; payload: number }
    | { type: reducerType.SET_COORDS; payload: mouse_coOrds }
    | { type: reducerType.SET_SORT; payload: {aToz: string, by: string} }
    | { type: reducerType.SET_OPENED_DDM; payload: string | null }
    | { type: reducerType.SET_SONG_LIST; payload: Song[] }
    | { type: reducerType.SET_SONG_MENU; payload: Song | null }
    | { type: reducerType.SET_PLAYLIST_MODAL; payload: boolean }
    | { type: reducerType.SET_PROPERTIES_MODAL; payload: boolean };

export interface AllTracksStateInterface{
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    SongList: Song[],
    songMenuToOpen: Song | null,
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
}