import { useSavedObjectStore, useUpcomingSongs, usePlayerStore, usePlayingPosition, 
    usePlayingPositionSec, useHistorySongs } from "store";
import { Song } from "types";
import { invoke } from "@tauri-apps/api";
import { SavedObject } from "@database/index";

export const addThisSongToPlayNext = (song: Song) => {
    //get the limit
    const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
    //get the song queue
    const res = useUpcomingSongs.getState().queue;
    //add the song to index position 1 in the queue
    const newQueue = [...res.slice(0, 1), song, ...res.slice(1)];
    //add the new queue from index 0 to index limit - 1
    useUpcomingSongs.getState().setQueue(newQueue.slice(0, limit - 1));
}

export const addThisSongToPlayLater = (song: Song) => {
    //get the limit
    const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
    //get the song queue
    let res = useUpcomingSongs.getState().queue;
    //if the list is bigger than the limit, remove the songs that are over the limit
    if(res.length >= limit)res = res.slice(0, limit - 2);
    //add the song to the end of the queue
    res.push(song);
    //add the new queue
    useUpcomingSongs.getState().setQueue(res);
}

export const playThisListNow = (songs: Song[]) => {
    //get the limit
    const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
    if(songs.length > limit)songs = songs.slice(0, limit - 1);
    useUpcomingSongs.getState().setQueue(songs);
}

export async function startPlayingNewSong(song: Song){
    const temp = usePlayerStore.getState().Player;
    temp.playingSongMetadata = song;
    temp.lengthOfSongInSeconds = song.duration_seconds;
    temp.isPlaying = true;
    await invoke("load_and_play_song_from_path", { soundPath: song.path });
    usePlayerStore.getState().setPlayer(temp);
}

export async function loadNewSong(song: Song){
    const temp = usePlayerStore.getState().Player;
    temp.playingSongMetadata = song;
    temp.lengthOfSongInSeconds = song.duration_seconds;
    temp.isPlaying = false;
    await invoke("load_a_song_from_path", { soundPath: song.path });
    usePlayerStore.getState().setPlayer(temp);
}

export async function playSong(){
    if(usePlayerStore.getState().Player.playingSongMetadata){
        await invoke("resume_playing");
        let temp = usePlayerStore.getState().Player;
        temp.isPlaying = true;
        temp.wasPlayingBeforePause = true;
        usePlayerStore.getState().setPlayer(temp);
    }
}

export async function pauseSong(){
    if(usePlayerStore.getState().Player.playingSongMetadata){
        await invoke("pause_song");
        let temp = usePlayerStore.getState().Player;
        temp.isPlaying = false;
        temp.wasPlayingBeforePause = false;
        usePlayerStore.getState().setPlayer(temp);
    }
}

export async function stopSong(){
    if(usePlayerStore.getState().Player.playingSongMetadata){
        await invoke("stop_song");
        let temp = usePlayerStore.getState().Player;
        temp.playingSongMetadata = null;
        temp.lengthOfSongInSeconds = 0;
        temp.isPlaying = false;
        temp.wasPlayingBeforePause = false;
        usePlayerStore.getState().setPlayer(temp);
    }
}

export async function dragSeeker(){
    //that value is bounded between 0 and 100
    if(usePlayerStore.getState().Player.playingSongMetadata === null)return;
    if(usePlayerStore.getState().Player.isPlaying === false)return;
    await pauseSong();
    let temp = usePlayerStore.getState().Player;
    temp.wasPlayingBeforePause = true;
    usePlayerStore.getState().setPlayer(temp);
}

export function changeSeekerPosition(value: number){
    if(usePlayerStore.getState().Player.playingSongMetadata === null)return;
    const position = (value / 100) * usePlayerStore.getState().Player.lengthOfSongInSeconds;
    invoke("seek_to", {position: position}).then(() => {if(usePlayerStore.getState().Player.wasPlayingBeforePause === true)playSong()})
}

export function changeVolumeLevel(value: number){
    //that value is bounded between 0 and 100
    let temp: SavedObject = useSavedObjectStore.getState().local_store;
    temp.Volume = value;
    useSavedObjectStore.getState().setStore(temp);
}

export async function setVolumeLevel(value: number){
    const volume = Math.floor(value / 100);
    /*await invoke("set_volume", {volume: volume});*/
}

export function changeVolumeLevelBtnPress(isDecreasing: boolean){
    if(isDecreasing === true){
        const level: number = (useSavedObjectStore.getState().local_store.Volume - parseInt(useSavedObjectStore.getState().local_store.VolumeStepAmount));
        let temp: SavedObject = useSavedObjectStore.getState().local_store;
        temp.Volume = level <= 0 ? 0 : level;
        useSavedObjectStore.getState().setStore(temp);
        if(level >= 0)setVolumeLevel(temp.Volume);
    }
    else{
        const level: number = (useSavedObjectStore.getState().local_store.Volume + parseInt(useSavedObjectStore.getState().local_store.VolumeStepAmount));
        let temp: SavedObject = useSavedObjectStore.getState().local_store;
        temp.Volume = level >= 100 ? 100 : level;
        useSavedObjectStore.getState().setStore(temp);
        if(level <= 100)setVolumeLevel(temp.Volume);
    }
}

export function shuffleToggle(){
    let temp = usePlayerStore.getState().Player;
    temp.isShuffling = !usePlayerStore.getState().Player.isShuffling;
    usePlayerStore.getState().setPlayer(temp);
}

export function repeatToggle(){
    let temp = usePlayerStore.getState().Player;
    temp.repeatingLevel = usePlayerStore.getState().Player.repeatingLevel + 1 > 2 ? 0 : (usePlayerStore.getState().Player.repeatingLevel + 1) as 0 | 1 | 2;
    usePlayerStore.getState().setPlayer(temp);
}

export function reconfigurePlayer_AtEndOfSong(){
    const song = usePlayerStore.getState().Player.playingSongMetadata;
    if(song === null)return;
    //stop song if any song is playing
    stopSong().then(() => {
        usePlayingPositionSec.getState().setPosition(0);
        usePlayingPosition.getState().setPosition(0);
        if((usePlayerStore.getState().Player.repeatingLevel === 0 || 
            usePlayerStore.getState().Player.repeatingLevel === 1) && useUpcomingSongs.getState().queue.length >= 2){
                //no repeating
                useHistorySongs.getState().enqueue(song);
                startPlayingNewSong(useUpcomingSongs.getState().queue[1]);
                useUpcomingSongs.getState().dequeue();
        }
        else if(usePlayerStore.getState().Player.repeatingLevel === 1 && useUpcomingSongs.getState().queue.length >= 1){
            //repeat the entire history once you reach the end
            //IDK HOW i'LL DO THIS YET
            const SongHistory = useHistorySongs.getState().queue;
            startPlayingNewSong(SongHistory[SongHistory.length - 1]);
            useUpcomingSongs.getState().setQueue(SongHistory.reverse());
            useHistorySongs.getState().clearQueue();
        }
        else if(usePlayerStore.getState().Player.repeatingLevel === 2){
            startPlayingNewSong(song);
        }
    })
}

export function playNextSong(){
    const song = usePlayerStore.getState().Player.playingSongMetadata;
    if(song === null)return;
    useHistorySongs.getState().enqueue(song);
    usePlayingPositionSec.getState().setPosition(0);
    usePlayingPosition.getState().setPosition(0);
    if(usePlayerStore.getState().Player.isPlaying){
        startPlayingNewSong(useUpcomingSongs.getState().queue[1]);
    }
    else{
        loadNewSong(useUpcomingSongs.getState().queue[1]);
    }
    useUpcomingSongs.getState().dequeue();
}

export function playPreviousSong(){
    if(useHistorySongs.getState().queue.length >= 1){
        const SongHistory = useHistorySongs.getState().queue;
        usePlayingPositionSec.getState().setPosition(0);
        usePlayingPosition.getState().setPosition(0);
        if(usePlayerStore.getState().Player.isPlaying){
            startPlayingNewSong(SongHistory[SongHistory.length - 1]);
        }
        else{
            loadNewSong(SongHistory[SongHistory.length - 1]);
        }
        useUpcomingSongs.getState().push_front(SongHistory[SongHistory.length - 1]);
        useHistorySongs.getState().pop_back();
    }
}