import { Song } from "@muziktypes/index";
import { Action, reducerType } from "@store/reducerTypes";

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