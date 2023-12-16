import { Song } from "types";

export interface Player{
    playingSongMetadata: Song | null;
    isPlaying: boolean;
    playingPosition: number;
    isShuffling: boolean;
    repeatingLevel: 0 | 1 | 2;
}

export const emptyPlayer: Player = {
    playingSongMetadata: null,
    isPlaying: false,
    playingPosition: 0,
    isShuffling: false,
    repeatingLevel: 0,
}