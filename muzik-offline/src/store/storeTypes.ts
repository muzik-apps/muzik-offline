import { SavedDirectories } from "@database/directories";
import { Player } from "@database/player";
import { SavedObject } from "@database/saved_object";
import { viewableSideEl } from "@database/side_elements";
import { SavedWallpaper } from "@database/wallpaper";
import { Song, toast } from "types";

export interface toastInterface{
    toastObject: toast | null;
    setToast: (toast: toast) => void;
    unsetToast: () => void;
}

export interface searchInterface{
    query: string;
    setSearch: (nq: string) => void;
}

export interface wallpaperInterface{
    wallpaper: SavedWallpaper | null;
    setWallpaper: (nW: SavedWallpaper) => void;
    unsetWallpaper: () => void;
}

export interface viewableSideElInterface{
    viewableEl: viewableSideEl;
    setviewableEl: (setTo: viewableSideEl) => void;
}

export interface SavedDirectoriesInterface{
    dir: SavedDirectories;
    setDir: (setTo: SavedDirectories) => void;
}

export interface SavedObjectInterface{
    local_store: SavedObject;
    setStore: (setTo: SavedObject) => void;
}

export interface PlayerInterface{
    Player: Player;
    setPlayer: (setTo: Player) => void;
}

export interface QueueInterface{
    queue: Song[];
    enqueue: (song: Song) => void;
    dequeue: () => void;
}