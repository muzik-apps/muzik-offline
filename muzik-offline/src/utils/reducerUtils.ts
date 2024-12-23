import { Song, toastType } from "@muziktypes/index";
import { Action, reducerType } from "@store/reducerTypes";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from '@tauri-apps/plugin-dialog';
import { appConfigDir } from '@tauri-apps/api/path';
import { reloadLibrary } from ".";
import { invoke } from "@tauri-apps/api/core";
import { useToastStore } from "@store/index";
import { local_albums_db, local_artists_db, local_genres_db, local_songs_db } from "@database/database";

export function selectThisSong(index: number, dispatch: React.Dispatch<Action>){ 
    dispatch({ type: reducerType.SET_SELECTED, payload: index }); 
}

export function setCoords(xPos: number, yPos: number, dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_COORDS, payload: { xPos, yPos } });
}

export function selectSortOption(sort: {aToz: string, by: string}, openedDDM: string | null, arg: string, dispatch: React.Dispatch<Action>){
    if(openedDDM === "aToz" && arg !== sort.aToz)dispatch({ type: reducerType.SET_SORT, payload: {aToz: arg, by: sort.by}});
    if(openedDDM === "by" && arg !== sort.by)dispatch({ type: reducerType.SET_SORT, payload: {aToz: sort.aToz, by: arg}});
    dispatch({ type: reducerType.SET_OPENED_DDM, payload: null});
}

export function setOpenedDDM(ddm: string | null, dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_OPENED_DDM, payload: ddm });
}

export function setSongList(songList: Song[], dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_SONG_LIST, payload: songList });
}

export function closeCreatePlaylistModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_CREATE_PLAYLIST_MODAL, payload: false });
    closeContextMenu(dispatch);
}

export function closeEditPlaylistModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_EDIT_PLAYLIST_MODAL, payload: false });
    closeContextMenu(dispatch);
}

export function closeDeletePlaylistModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_DELETE_MODAL, payload: false });
    closeContextMenu(dispatch);
}

export function closePlaylistModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: false });
    closeContextMenu(dispatch);
}

export function closePropertiesModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: false });
    closeContextMenu(dispatch);
}

export function closeEditPropertiesModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_EDIT_SONG_MODAL, payload: false });
    closeContextMenu(dispatch);
}

export async function closeDeleteSongModal(dispatch: React.Dispatch<Action>, song: Song | null, deleteSong: boolean){
    dispatch({ type: reducerType.SET_DELETE_MODAL, payload: false });
    closeContextMenu(dispatch);
    if(!deleteSong)return;
    if(!song){
        useToastStore.getState().setToast({
            message: "Song not found", 
            type: toastType.error, 
            title: "Delete Song Error", 
            timeout: 3000
        });
        return;
    }
    const album_appearance_count = await local_albums_db.albums.where('title').equals(song.album).count();
    const artist_appearance_count = await local_artists_db.artists.where('artist_name').equals(song.artist).count();
    const genre_appearance_count = await local_genres_db.genres.where('title').equals(song.genre).count();

    invoke('delete_song_metadata', { 
        path: song.path,
        album: song.album,
        albumAppearanceCount: album_appearance_count,
        artist: song.artist,
        artistAppearanceCount: artist_appearance_count,
        genre: song.genre,
        genreAppearanceCount: genre_appearance_count 
    }).then(() => {
        local_songs_db.songs.where('uuid').equals(song.uuid).delete();
        if (album_appearance_count <= 1) local_albums_db.albums.where('title').equals(song.album).delete();
        if (artist_appearance_count <= 1) local_artists_db.artists.where('artist_name').equals(song.artist).delete();
        if (genre_appearance_count <= 1) local_genres_db.genres.where('title').equals(song.genre).delete();
        useToastStore.getState().setToast({
            message: `${song.name} was sent to trash`,
            type: toastType.success, 
            title: "Delete Song", 
            timeout: 3000
        });
    }).catch((err: any) => {
        useToastStore.getState().setToast({
            message: err,
            type: toastType.error, 
            title: "Delete Song Error", 
            timeout: 3000
        });
    });
}

export function closeContextMenu( dispatch: React.Dispatch<Action>, e?: React.MouseEvent<HTMLDivElement, MouseEvent>,){
    if(e){
        if(e.target !== e.currentTarget)return;
        e.preventDefault();
    }
    dispatch({ type: reducerType.SET_SONG_MENU, payload: null});
    dispatch({ type: reducerType.SET_ALBUM_MENU, payload: null});
    dispatch({ type: reducerType.SET_ARTIST_MENU, payload: null});
    dispatch({ type: reducerType.SET_GENRE_MENU, payload: null});
    dispatch({ type: reducerType.SET_PLAYLIST_MENU, payload: null});
    dispatch({ type: reducerType.SET_COORDS, payload: {xPos: 0, yPos: 0}});
}

export function processArrowKeysInput(
    ev: any, 
    dispatch: React.Dispatch<Action>,
    selected: number,
    SongListLength: number
){
    if((selected === 1 || selected === 0) && ev.key === "ArrowUp"){
        return;
    }
    else if(selected === SongListLength && ev.key === "ArrowDown"){
        return;
    }
    else if(ev.key === "ArrowUp")selectThisSong(--selected, dispatch);
    else if(ev.key === "ArrowDown")selectThisSong(++selected, dispatch);
}

export async function processDragEvents(dispatch: React.Dispatch<Action>){
    const unlisten = await getCurrentWebview().onDragDropEvent(async(event) => {
        if(event.payload.type === 'enter')dispatch({ type: reducerType.SET_IN_DRAG_DROP_REGION, payload: true});
        else if(event.payload.type === 'leave')dispatch({ type: reducerType.SET_IN_DRAG_DROP_REGION, payload: false});
        else if (event.payload.type === 'drop') {
            dispatch({ type: reducerType.SET_IN_DRAG_DROP_REGION, payload: false});
            await reloadLibrary(event.payload.paths);
        }
    });

    return unlisten;
}

export async function openFileDialogDND(){
    const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: await appConfigDir(),
    });
    if(selected) await reloadLibrary([selected]);
}