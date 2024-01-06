import { Song } from "types";
import { Action, reducerType } from "store/reducerTypes";

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

export function closePlaylistModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: false });
    dispatch({ type: reducerType.SET_SONG_MENU, payload: null});
}

export function closePropertiesModal(dispatch: React.Dispatch<Action>){
    dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: false });
    dispatch({ type: reducerType.SET_SONG_MENU, payload: null});
}

export function closeContextMenu( dispatch: React.Dispatch<Action>, e?: React.MouseEvent<HTMLDivElement, MouseEvent>,){
    if(e){
        if(e.target !== e.currentTarget)return;
        e.preventDefault();
    }
    dispatch({ type: reducerType.SET_SONG_MENU, payload: null});
    dispatch({ type: reducerType.SET_ALBUM_MENU, payload: null});
    dispatch({ type: reducerType.SET_COORDS, payload: {xPos: 0, yPos: 0}});
}