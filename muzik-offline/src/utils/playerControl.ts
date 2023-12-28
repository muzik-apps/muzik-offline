import { useSavedObjectStore, useUpcomingSongs, usePlayerStore, usePlayingPosition, 
    usePlayingPositionSec, useHistorySongs } from "store";
import { Song } from "types";
import { invoke } from "@tauri-apps/api";
import { SavedObject } from "@database/index";
import { local_songs_db } from "@database/database";

export const addThisSongToPlayNext = (songid: number) => {
    //get the song queue
    const res = useUpcomingSongs.getState().queue;
    //add the song to index position 1 in the queue
    const newQueue = [...res.slice(0, 1), songid, ...res.slice(1)];
    //add the new queue from index 0 to index limit - 1
    useUpcomingSongs.getState().setQueue(newQueue);
}

export const addThisSongToPlayLater = (songid: number) => {
    //get the limit
    const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
    //get the song queue
    let res = useUpcomingSongs.getState().queue;
    //add the song to the index before the limit
    res.splice(limit - 1, 0, songid);
    //add the new queue
    useUpcomingSongs.getState().setQueue(res);
}

export async function startPlayingNewSong(song: Song){
    const temp = usePlayerStore.getState().Player;
    temp.playingSongMetadata = song;
    temp.lengthOfSongInSeconds = song.duration_seconds;
    temp.isPlaying = true;
    const volume = (useSavedObjectStore.getState().local_store.Volume / 100);
    await invoke("load_and_play_song_from_path", { soundPath: song.path, volume: volume });
    usePlayerStore.getState().setPlayer(temp);
}

export async function loadNewSong(song: Song){
    const temp = usePlayerStore.getState().Player;
    temp.playingSongMetadata = song;
    temp.lengthOfSongInSeconds = song.duration_seconds;
    temp.isPlaying = false;
    const volume = (useSavedObjectStore.getState().local_store.Volume / 100);
    await invoke("load_a_song_from_path", { soundPath: song.path, volume: volume });
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

export async function setVolumeLevel(value: number){await invoke("set_volume", {volume: value / 100});}

export function changeVolumeLevelBtnPress(isDecreasing: boolean){
    if(isDecreasing === true){
        const level: number = Number(useSavedObjectStore.getState().local_store.Volume) - parseInt(useSavedObjectStore.getState().local_store.VolumeStepAmount);
        let temp: SavedObject = useSavedObjectStore.getState().local_store;
        temp.Volume = level <= 0 ? 0 : level;
        useSavedObjectStore.getState().setStore(temp);
        if(level >= 0)setVolumeLevel(temp.Volume);
    }
    else{
        const level: number = Number(useSavedObjectStore.getState().local_store.Volume)  + parseInt(useSavedObjectStore.getState().local_store.VolumeStepAmount);
        let temp: SavedObject = useSavedObjectStore.getState().local_store;
        temp.Volume = level >= 100 ? 100 : level;
        useSavedObjectStore.getState().setStore(temp);
        if(level <= 100)setVolumeLevel(temp.Volume);
    }
}

export async function shuffleToggle(){
    let temp = usePlayerStore.getState().Player;
    temp.isShuffling = !usePlayerStore.getState().Player.isShuffling;
    usePlayerStore.getState().setPlayer(temp);
    await invoke("mlo_set_shuffle_list", {shuffleList: temp.isShuffling});
}

export async function repeatToggle(){
    let temp = usePlayerStore.getState().Player;
    temp.repeatingLevel = usePlayerStore.getState().Player.repeatingLevel + 1 > 2 ? 0 : (usePlayerStore.getState().Player.repeatingLevel + 1) as 0 | 1 | 2;
    usePlayerStore.getState().setPlayer(temp);
    await invoke("mlo_set_repeat_list", {repeatList: temp.repeatingLevel > 0 ? true : false});
}

export function reconfigurePlayer_AtEndOfSong(){
    if(usePlayerStore.getState().Player.repeatingLevel === 0 || usePlayerStore.getState().Player.repeatingLevel === 1){
        playNextSong();
    }
    else if(usePlayerStore.getState().Player.repeatingLevel === 2){
        const song = usePlayerStore.getState().Player.playingSongMetadata;
        if(song === null)return;
        usePlayingPositionSec.getState().setPosition(0);
        usePlayingPosition.getState().setPosition(0);
        startPlayingNewSong(song);
    }
}

export async function playNextSong(){
    const song = usePlayerStore.getState().Player.playingSongMetadata;
    if(song === null)return;
    useHistorySongs.getState().enqueue(song.id);
    usePlayingPositionSec.getState().setPosition(0);
    usePlayingPosition.getState().setPosition(0);
    if(useUpcomingSongs.getState().queue.length <= 1){
        const temp = usePlayerStore.getState().Player;
        temp.playingSongMetadata = null;
        temp.lengthOfSongInSeconds = 0;
        temp.isPlaying = false;
        temp.wasPlayingBeforePause = false;
        usePlayerStore.getState().setPlayer(temp);
        useUpcomingSongs.getState().dequeue();
        await stopSong();
    }
    else{
        const toplayid = useUpcomingSongs.getState().queue[1];
        const toplay = await local_songs_db.songs.where("id").equals(toplayid).first();
        if(toplay === undefined)return;//the likelihood of this happening is basically impossible

        if(usePlayerStore.getState().Player.isPlaying) startPlayingNewSong(toplay);
        else loadNewSong(toplay);
        useUpcomingSongs.getState().dequeue();
        //if the size of the list is equal to the limit, get another batch from the backend
        const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
        if(useUpcomingSongs.getState().queue.length === limit)get_next_batch(limit);
    }
}

export async function playPreviousSong(){
    if(useHistorySongs.getState().queue.length >= 1){
        const SongHistory = useHistorySongs.getState().queue;
        usePlayingPositionSec.getState().setPosition(0);
        usePlayingPosition.getState().setPosition(0);
        const toplay = await local_songs_db.songs.where("id").equals(SongHistory[SongHistory.length - 1]).first();
        if(toplay === undefined)return;//the likelihood of this happening is basically impossible
        if(usePlayerStore.getState().Player.isPlaying)startPlayingNewSong(toplay);
        else loadNewSong(toplay);
        useUpcomingSongs.getState().push_front(SongHistory[SongHistory.length - 1]);
        useHistorySongs.getState().pop_back();
    }
}

export async function playThisListNow(list: number[], shuffle_list: boolean){
    const resp = await invoke("mlo_set_shuffle_list", {shuffleList: shuffle_list});
    if(resp === "FAILED")return;
    const res = await invoke("mlo_reset_and_set_remaining_keys", {remainingKeys: list});
    if(res === "FAILED")return;
    const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
    const keys: any = await invoke("mlo_get_next_batch_as_size", {size: ((limit * 2) - 1)});
    //prepend currently playing song to songs list
    const song = usePlayerStore.getState().Player.playingSongMetadata;
    if(song !== null)keys.unshift(song.id);
    useUpcomingSongs.getState().setQueue(keys);
}

export async function get_next_batch(limit: number){
    const keys: any = await invoke("mlo_get_next_batch_as_size", {size: ((limit * 2) - 1)});
    //get the songs from the keys
    const queue = useUpcomingSongs.getState().queue;
    //append the songs to the end of the queue
    queue.push(...keys);
    useUpcomingSongs.getState().setQueue(queue);
}