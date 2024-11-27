import { Song, mouse_coOrds, AlbumMD, album, artist, genre, playlist,
ArtistMD, GenreMD, PlaylistMD } from "@muziktypes/index";

export enum reducerType {
    SET_LOADING = "SET_LOADING",
    SET_SELECTED = "SET_SELECTED",
    SET_SELECTED_VIEW = "SET_SELECTED_VIEW",
    SET_COORDS = "SET_COORDS",
    SET_SORT = "SET_SORT",
    SET_OPENED_DDM = "SET_OPENED_DDM",
    SET_PLAYLIST_MODAL = "SET_PLAYLIST_MODAL",
    SET_EDIT_PLAYLIST_MODAL = "SET_EDIT_PLAYLIST_MODAL",
    SET_CREATE_PLAYLIST_MODAL = "SET_CREATE_PLAYLIST_MODAL",
    SET_PROPERTIES_MODAL = "SET_PROPERTIES_MODAL",
    SET_EDIT_SONG_MODAL = "SET_EDIT_SONG_MODAL",
    SET_DELETE_MODAL = "SET_DELETE_MODAL",
    SET_RESIZE_HEADER = "SET_RESIZE_HEADER",
    SET_SONG_LIST = "SET_SONG_LIST",
    SET_SONG_MENU = "SET_SONG_MENU",
    SET_ALBUM_LIST = "SET_ALBUM_LIST",
    SET_ALBUM_MENU = "SET_ALBUM_MENU",
    SET_ARTIST_LIST = "SET_ARTIST_LIST",
    SET_ARTIST_MENU = "SET_ARTIST_MENU",
    SET_GENRE_LIST = "SET_GENRE_LIST",
    SET_GENRE_MENU = "SET_GENRE_MENU",
    SET_PLAYLIST_LIST = "SET_PLAYLIST_LIST",
    SET_PLAYLIST_MENU = "SET_PLAYLIST_MENU",
    SET_ALBUM_METADATA = "SET_ALBUM_METADATA",
    SET_ARTIST_METADATA = "SET_ARTIST_METADATA",
    SET_GENRE_METADATA = "SET_GENRE_METADATA",
    SET_PLAYLIST_METADATA = "SET_PLAYLIST_METADATA",
    SET_SONG_QUEUE = "SET_SONG_QUEUE",
    SET_SONG_HISTORY = "SET_SONG_HISTORY",
    SET_KEY_INDEX_SONG_QUEUE = "SET_KEY_INDEX_SONG_QUEUE",
    ADD_PLAYLIST = "ADD_PLAYLIST",
    REMOVE_PLAYLIST = "REMOVE_PLAYLIST",
    SET_IN_DRAG_DROP_REGION = "SET_IN_DRAG_DROP_REGION",
    SET_IS_DRAGGING_ITEM = "SET_IS_DRAGGING_ITEM",
    REPLACE_PLAYLIST = "REPLACE_PLAYLIST",
}

export type Action =
    | { type: reducerType.SET_LOADING; payload: boolean }
    | { type: reducerType.SET_SELECTED; payload: number }
    | { type: reducerType.SET_SELECTED_VIEW; payload: string }
    | { type: reducerType.SET_COORDS; payload: mouse_coOrds }
    | { type: reducerType.SET_SORT; payload: {aToz: string, by: string} }
    | { type: reducerType.SET_OPENED_DDM; payload: string | null }
    | { type: reducerType.SET_PLAYLIST_MODAL; payload: boolean }
    | { type: reducerType.SET_EDIT_PLAYLIST_MODAL; payload: boolean }
    | { type: reducerType.SET_CREATE_PLAYLIST_MODAL; payload: boolean }
    | { type: reducerType.SET_PROPERTIES_MODAL; payload: boolean }
    | { type: reducerType.SET_EDIT_SONG_MODAL; payload: boolean }
    | { type: reducerType.SET_DELETE_MODAL; payload: boolean }
    | { type: reducerType.SET_RESIZE_HEADER; payload: boolean }
    | { type: reducerType.SET_SONG_LIST; payload: Song[] }
    | { type: reducerType.SET_SONG_MENU; payload: Song | null }
    | { type: reducerType.SET_ALBUM_LIST; payload: album[] }
    | { type: reducerType.SET_ALBUM_MENU; payload: album | null}
    | { type: reducerType.SET_ARTIST_LIST; payload: artist[] }
    | { type: reducerType.SET_ARTIST_MENU; payload: artist | null}
    | { type: reducerType.SET_GENRE_LIST; payload: genre[] }
    | { type: reducerType.SET_GENRE_MENU; payload: genre | null}
    | { type: reducerType.SET_PLAYLIST_LIST; payload: playlist[] }
    | { type: reducerType.SET_PLAYLIST_MENU; payload: playlist | null}
    | { type: reducerType.SET_ALBUM_METADATA; payload: AlbumMD }
    | { type: reducerType.SET_ARTIST_METADATA; payload: ArtistMD }
    | { type: reducerType.SET_GENRE_METADATA; payload: GenreMD }
    | { type: reducerType.SET_PLAYLIST_METADATA; payload: PlaylistMD }
    | { type: reducerType.SET_SONG_QUEUE; payload: Song[] }
    | { type: reducerType.SET_SONG_HISTORY; payload: Song[] }
    | { type: reducerType.SET_KEY_INDEX_SONG_QUEUE; payload: {key: number, index: number, queueType: "SongQueue" | "SongHistory"} }
    | { type: reducerType.ADD_PLAYLIST; payload: playlist }
    | { type: reducerType.REMOVE_PLAYLIST; payload: number }
    | { type: reducerType.SET_IN_DRAG_DROP_REGION; payload: boolean }
    | { type: reducerType.SET_IS_DRAGGING_ITEM; payload: boolean }
    | { type: reducerType.REPLACE_PLAYLIST; payload: playlist }








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
    isEditingSongModalOpen: boolean,
    inDragDropRegion: boolean,
}

export interface SearchSongInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    SongList: Song[],
    songMenuToOpen: Song | null,
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
    isEditingSongModalOpen: boolean,
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
    isEditingSongModalOpen: boolean,
    resizeHeader: boolean;
}

export interface AllAlbumsInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    albumList: album[],
    albumMenuToOpen: album | null,
    isPlaylistModalOpen: boolean,
    inDragDropRegion: boolean,
}

export interface AllArtistsInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    artistList: artist[],
    artistMenuToOpen: artist | null,
    isPlaylistModalOpen: boolean,
    inDragDropRegion: boolean,
}

export interface ArtistCatalogueInterface{
    selected: number,
    co_ords: mouse_coOrds,
    albumList: album[],
    albumMenuToOpen: album | null,
    artist_metadata: ArtistMD,
    resizeHeader: boolean;
    isPlaylistModalOpen: boolean,
}

export interface AllGenresInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    genreList: genre[],
    genreMenuToOpen: genre | null,
    isPlaylistModalOpen: boolean,
    inDragDropRegion: boolean,
}

export interface GenreViewInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    SongList: Song[],
    genre_metadata: GenreMD,
    songMenuToOpen: Song | null,
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
    isEditingSongModalOpen: boolean,
    resizeHeader: boolean;
}

export interface AllPlaylistsInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    sort: {aToz: string, by: string},
    openedDDM: string | null,
    playlistList: playlist[],
    playlistMenuToOpen: playlist | null,
    isPlaylistModalOpen: boolean,
    isCreatePlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
    isDeletePlayListModalOpen: boolean,
    isEditingPlayListModalOpen: boolean,
}

export interface PlaylistViewInterface{
    isloading: boolean,
    selected: number,
    co_ords: mouse_coOrds,
    SongList: Song[],
    playlist_metadata: PlaylistMD,
    songMenuToOpen: Song | null,
    isEditingPlayListModalOpen: boolean,
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
    isDeleteSongModalOpen: boolean,
    isEditingSongModalOpen: boolean,
    resizeHeader: boolean;
}

export interface UpcomingHistoryInterface{
    selectedView: string,
    co_ords: mouse_coOrds,
    songMenuToOpen: Song | null,
    SongQueue: Song[],
    SongHistory: Song[],
    isPlaylistModalOpen: boolean,
    isPropertiesModalOpen: boolean,
    isEditingSongModalOpen: boolean,
    kindex_sq: {key: number, index: number, queueType: "SongQueue" | "SongHistory"},
}