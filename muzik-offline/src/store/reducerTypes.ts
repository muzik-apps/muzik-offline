import { Song, mouse_coOrds, AlbumMD, album, artist } from "types";

export enum reducerType {
    SET_LOADING = "SET_LOADING",
    SET_SELECTED = "SET_SELECTED",
    SET_COORDS = "SET_COORDS",
    SET_SORT = "SET_SORT",
    SET_OPENED_DDM = "SET_OPENED_DDM",
    SET_SONG_LIST = "SET_SONG_LIST",
    SET_SONG_MENU = "SET_SONG_MENU",
    SET_PLAYLIST_MODAL = "SET_PLAYLIST_MODAL",
    SET_PROPERTIES_MODAL = "SET_PROPERTIES_MODAL",
    SET_ALBUM_METADATA = "SET_ALBUM_METADATA",
    SET_ALBUM_LIST = "SET_ALBUM_LIST",
    SET_ALBUM_MENU = "SET_ALBUM_MENU",
    SET_ARTIST_LIST = "SET_ARTIST_LIST",
    SET_ARTIST_MENU = "SET_ARTIST_MENU"

}

export type Action =
    | { type: reducerType.SET_LOADING; payload: boolean }
    | { type: reducerType.SET_SELECTED; payload: number }
    | { type: reducerType.SET_COORDS; payload: mouse_coOrds }
    | { type: reducerType.SET_SORT; payload: {aToz: string, by: string} }
    | { type: reducerType.SET_OPENED_DDM; payload: string | null }
    | { type: reducerType.SET_SONG_LIST; payload: Song[] }
    | { type: reducerType.SET_SONG_MENU; payload: Song | null }
    | { type: reducerType.SET_PLAYLIST_MODAL; payload: boolean }
    | { type: reducerType.SET_PROPERTIES_MODAL; payload: boolean }
    | { type: reducerType.SET_ALBUM_METADATA; payload: AlbumMD }
    | { type: reducerType.SET_ALBUM_LIST; payload: album[] }
    | { type: reducerType.SET_ALBUM_MENU; payload: album | null}
    | { type: reducerType.SET_ARTIST_LIST; payload: artist[] }
    | { type: reducerType.SET_ARTIST_MENU; payload: artist | null}







// INTERFACES
export interface AllTracksStateInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    SongList: Song[],
    songMenuToOpen: Song | null,
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
}

export interface AlbumDetailsInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    SongList: Song[],
    album_metadata: AlbumMD,
    songMenuToOpen: Song | null,
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
}

export interface AllAlbumsInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    albumList: album[],
    albumMenuToOpen: album | null,
}

export interface AllArtistsInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    artistList: artist[],
    artistMenuToOpen: artist | null,
}