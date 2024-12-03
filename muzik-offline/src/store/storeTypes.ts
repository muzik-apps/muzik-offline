import { SavedDirectories } from "@database/directories";
import { Player } from "@database/player";
import { SavedObject } from "@database/saved_object";
import { viewableSideEl } from "@database/side_elements";
import { toast } from "@muziktypes/index";

export interface MaximisedState {
    isMaximised: boolean;
    setMaximised: (nM: boolean) => void;
}

export interface firstRunState{
    firstRun: boolean;
    setFirstRun: (nFR: boolean) => void;
}

export interface portState{
    port: number;
    setPort: (nPort: number) => void;
}

export interface FSState{
    isFS: boolean;
    setFS: (nFS: boolean) => void;
}

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
    wallpaperUUID: string | null;
    setWallpaper: (nW: string) => void;
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

export interface PlayingPositionInterface{
    position: number;
    setPosition: (setTo: number) => void;
}

export interface PlayingPositionSecInterface{
    position: number;
    setPosition: (setTo: number) => void;
}

export interface QueueInterface{
    queue: number[];
    enqueue: (song: number) => void;
    dequeue: () => void;
    clearQueue: () => void;
    push_front: (song: number) => void;
    pop_back: () => void;
    setQueue: (setTo: number[]) => void;
}