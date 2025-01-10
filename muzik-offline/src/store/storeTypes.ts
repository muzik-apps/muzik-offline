import { SavedDirectories } from "@database/directories";
import { Player } from "@database/player";
import { SavedObject } from "@database/saved_object";
import { viewableSideEl } from "@database/side_elements";
import { AudioLabPreset, toast } from "@muziktypes/index";

export interface MaximisedState {
    isMaximised: boolean;
    setMaximised: (nM: boolean) => void;
}

export interface firstRunState{
    firstRun: boolean;
    setFirstRun: (nFR: boolean) => void;
    reset: () => void;
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
    reset: () => void;
}

export interface viewableSideElInterface{
    viewableEl: viewableSideEl;
    setviewableEl: (setTo: viewableSideEl) => void;
    reset: () => void;
}

export interface SavedDirectoriesInterface{
    dir: SavedDirectories;
    setDir: (setTo: SavedDirectories) => void;
    reset: () => void;
}

export interface SavedObjectInterface{
    local_store: SavedObject;
    setStore: (setTo: SavedObject) => void;
    reset: () => void;
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

export interface SavedPresetsValues{
    map: Map<string, AudioLabPreset>;
    addValue: (key: string, value: AudioLabPreset) => void;
    set: (setTo: Map<string, AudioLabPreset>) => void;
}

export interface VersionInterface{
    version: string;
    setVersion: (setTo: string) => void;
}

export interface PackagesInterface{
    packages: {name: string, description: string, installed: boolean, version: string}[];
    setPackages: (setTo: {name: string, description: string, installed: boolean, version: string}[]) => void;
    reset: () => void;
}