import { Song } from "@muziktypes/index";

export enum RepeatingLevel{
    NO_REPEAT,
    REPEAT_ONE,
    REPEAT_ALL
}

export interface Player{
    playingSongMetadata: Song | null;
    isPlaying: boolean;
    wasPlayingBeforePause: boolean;
    lengthOfSongInSeconds: number;
    isShuffling: boolean;
    repeatingLevel: RepeatingLevel;
    WaveFormPath: string | null;
}

export const emptyPlayer: Player = {
    playingSongMetadata: null,
    isPlaying: false,
    wasPlayingBeforePause: false,
    lengthOfSongInSeconds: 0,
    isShuffling: false,
    repeatingLevel: RepeatingLevel.NO_REPEAT,
    WaveFormPath: null,
}