import { Song } from "@muziktypes/index";

export interface Player{
    playingSongMetadata: Song | null;
    isPlaying: boolean;
    wasPlayingBeforePause: boolean;
    lengthOfSongInSeconds: number;
    isShuffling: boolean;
    repeatingLevel: 0 | 1 | 2;
}

export const emptyPlayer: Player = {
    playingSongMetadata: null,
    isPlaying: false,
    wasPlayingBeforePause: false,
    lengthOfSongInSeconds: 0,
    isShuffling: false,
    repeatingLevel: 0,
}