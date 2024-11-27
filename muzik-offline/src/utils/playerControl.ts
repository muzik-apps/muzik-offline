import { useSavedObjectStore, useUpcomingSongs, usePlayerStore, usePlayingPosition, 
    usePlayingPositionSec, useHistorySongs } from "@store/index";
import { playerState, Song } from "@muziktypes/index";
import { invoke } from "@tauri-apps/api/core";
import { SavedObject } from "@database/index";
import { local_playlists_db, local_songs_db } from "@database/database";
import { getNullRandomCover } from ".";

export const addThisSongToPlayNext = async(songids: number[]) => {
    //get the song queue
    const res = useUpcomingSongs.getState().queue;
    //add the song to index position 1 in the queue
    const newQueue = [...res.slice(0, 1), ...songids, ...res.slice(1)];
    //add the new queue from index 0 to index limit - 1
    useUpcomingSongs.getState().setQueue(newQueue);

    const song = usePlayerStore.getState().Player.playingSongMetadata;
    if(song === null && songids.length >= 1){
        const toplay = await local_songs_db.songs.where("id").equals(songids[0]).first();
        if(toplay === undefined)return;
        loadNewSong(toplay);
    }
}

const findSongs = async(values: {album?: string, artist?: string, genre?: string, playlist?: string}): Promise<number[]> => {
    if(values.playlist === undefined){
        const result: {album?: string, artist?: string, genre?: string} = {};
        
        if(values.album !== undefined)result.album = values.album;
        if(values.artist !== undefined)result.artist = values.artist;
        if(values.genre !== undefined)result.genre = values.genre;
        return await local_songs_db.songs.where(result).primaryKeys() as number[];
    }
    else{
        const playlist = await local_playlists_db.playlists.where("title").equals(values.playlist).first();
        if(playlist === undefined)return [];
        return await local_songs_db.songs.where("path").anyOf(playlist.tracksPaths).primaryKeys() as number[];
    }
}

export const addTheseSongsToPlayNext = async(values: {album?: string, artist?: string, genre?: string, playlist?: string}) => {
    const songs = await findSongs(values);
    await addThisSongToPlayNext(songs);
}

export const addTheseSongsToPlayLater = async(values: {album?: string, artist?: string, genre?: string, playlist?: string}) => {
    const songs = await findSongs(values);
    await addThisSongToPlayLater(songs);
}

export const playTheseSongs = async(values: {album?: string, artist?: string, genre?: string, playlist?: string}) => {
    const songs = await findSongs(values);
    if(songs.length >= 1){
        //get first song
        const song = await local_songs_db.songs.where("id").equals(songs[0]).first();
        if(song !== undefined){
            useUpcomingSongs.getState().clearQueue();
            useUpcomingSongs.getState().push_front(song.id);
            startPlayingNewSong(song);
        }
    }
    if(songs.length > 1) await addThisSongToPlayNext(songs.slice(1));
}

export const addThisSongToPlayLater = async(songids: number[]) => {
    //get the limit
    const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
    //get the song queue
    let res = useUpcomingSongs.getState().queue;
    //add the song to the index before the limit
    const newQueue = [...res.slice(0, limit - 1), ...songids, ...res.slice(limit - 1)];
    //add the new queue
    useUpcomingSongs.getState().setQueue(newQueue);

    const song = usePlayerStore.getState().Player.playingSongMetadata;
    if(song === null && songids.length >= 1){
        const toplay = await local_songs_db.songs.where("id").equals(songids[0]).first();
        if(toplay === undefined)return;
        loadNewSong(toplay);
    }
}

export async function startPlayingNewSong(song: Song){
    const US_queue = useUpcomingSongs.getState().queue;
    if((US_queue.length >= 1 && US_queue[0] != song.id) || US_queue.length === 0){
        useUpcomingSongs.getState().push_front(song.id);
    }

    const temp = usePlayerStore.getState().Player;
    temp.playingSongMetadata = song;
    temp.lengthOfSongInSeconds = song.duration_seconds;
    temp.isPlaying = true;
    const volume = (useSavedObjectStore.getState().local_store.Volume / 100);
    await invoke("load_and_play_song_from_path", { soundPath: song.path, volume: volume });
    await invoke("update_metadata", { uuid: (song.cover_uuid !== null ? song.uuid : getNullRandomCover(song.id)) });
    await invoke("set_player_state", { state: playerState.Playing});
    usePlayerStore.getState().setPlayer(temp);
    setDiscordActivityWithTimestamps(song, 0);
}

export async function loadNewSong(song: Song){
    const temp = usePlayerStore.getState().Player;
    temp.playingSongMetadata = song;
    temp.lengthOfSongInSeconds = song.duration_seconds;
    temp.isPlaying = false;
    const volume = (useSavedObjectStore.getState().local_store.Volume / 100);
    await invoke("load_a_song_from_path", { soundPath: song.path, volume: volume });
    await invoke("update_metadata", { uuid: (song.cover_uuid !== null ? song.uuid : getNullRandomCover(song.id)) });
    usePlayerStore.getState().setPlayer(temp);
    setDiscordActivity(song);
}

export async function playSong(){
    if(usePlayerStore.getState().Player.playingSongMetadata){
        await invoke("resume_playing");
        await invoke("set_player_state", { state: playerState.Playing});
        let temp = usePlayerStore.getState().Player;
        temp.isPlaying = true;
        temp.wasPlayingBeforePause = true;
        usePlayerStore.getState().setPlayer(temp);
        setDiscordActivityWithTimestamps(usePlayerStore.getState().Player.playingSongMetadata);
    }
}

export async function pauseSong(){
    if(usePlayerStore.getState().Player.playingSongMetadata){
        await invoke("pause_song");
        await invoke("set_player_state", { state: playerState.Paused});
        let temp = usePlayerStore.getState().Player;
        temp.isPlaying = false;
        temp.wasPlayingBeforePause = false;
        usePlayerStore.getState().setPlayer(temp);
        setDiscordActivity(usePlayerStore.getState().Player.playingSongMetadata);
    }
}

export async function stopSong(){
    if(usePlayerStore.getState().Player.playingSongMetadata){
        await invoke("stop_song");
        await invoke("set_player_state", { state: playerState.Stopped});
        let temp = usePlayerStore.getState().Player;
        temp.playingSongMetadata = null;
        temp.lengthOfSongInSeconds = 0;
        temp.isPlaying = false;
        temp.wasPlayingBeforePause = false;
        usePlayerStore.getState().setPlayer(temp);
        setDiscordActivityWithTimestamps(null);
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
    invoke("seek_to", {position: position}).then(() => {if(usePlayerStore.getState().Player.wasPlayingBeforePause === true)playSong()});
}

export function changeSeekerPositionBtnPress(isDecreasing: boolean){
    if(usePlayerStore.getState().Player.playingSongMetadata === null)return;
    const position = usePlayingPositionSec.getState().position;
    const seekstepamount = parseInt(useSavedObjectStore.getState().local_store.SeekStepAmount);
    if(position <= 0 || position >= usePlayerStore.getState().Player.lengthOfSongInSeconds)return;
    let delta_amount = 0;
    if(isDecreasing === true){
        if(position <= seekstepamount)delta_amount = -(position);
        else delta_amount = -(seekstepamount);
        usePlayingPositionSec.getState().setPosition(position + delta_amount);
    }
    else{
        if(position > usePlayerStore.getState().Player.lengthOfSongInSeconds - seekstepamount)
            delta_amount = usePlayerStore.getState().Player.lengthOfSongInSeconds - position;
        else delta_amount = seekstepamount;
        usePlayingPositionSec.getState().setPosition(position + delta_amount);
    }
    invoke("seek_by", {
        delta: delta_amount ? delta_amount : 10.0
    }).then(() => {if(usePlayerStore.getState().Player.wasPlayingBeforePause === true)playSong()});
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
    useUpcomingSongs.getState().dequeue();
    if(useUpcomingSongs.getState().queue.length === 0 && usePlayerStore.getState().Player.repeatingLevel === 0)await stopSong();
    else if(useUpcomingSongs.getState().queue.length === 0 && usePlayerStore.getState().Player.repeatingLevel === 1){
        const limit = Number.parseInt(useSavedObjectStore.getState().local_store.UpcomingHistoryLimit);
        get_next_batch(limit).then(async() => {
            if(useUpcomingSongs.getState().queue.length >= 1){
                const toplayid = useUpcomingSongs.getState().queue[0];
                const toplay = await local_songs_db.songs.where("id").equals(toplayid).first();
                if(toplay === undefined)return;//the likelihood of this happening is basically impossible
                loadNewSong(toplay);
            }
        });
    }
    else{
        const toplayid = useUpcomingSongs.getState().queue[0];
        const toplay = await local_songs_db.songs.where("id").equals(toplayid).first();
        if(toplay === undefined)return;//the likelihood of this happening is basically impossible
        if(usePlayerStore.getState().Player.isPlaying) startPlayingNewSong(toplay);
        else loadNewSong(toplay);
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

export async function playThisSongFromQueue(key: number, index: number, queueType: "SongQueue" | "SongHistory"){
    if(queueType === "SongQueue"){
        //get the song queue
        const res = useUpcomingSongs.getState().queue;
        //add the song to index position 1 in the queue
        const newQueue = [...res.slice(index)];
        //add the new queue from index 0 to index limit - 1
        useUpcomingSongs.getState().setQueue(newQueue);
    }
    const toplay = await local_songs_db.songs.where("id").equals(key).first();
    if(toplay === undefined)return;//the likelihood of this happening is basically impossible
    startPlayingNewSong(toplay);
}

export async function playSongsFromThisArtist(shuffle: boolean, artist_name: string){
    const songkeys = await local_songs_db.songs.where("artist").equals(artist_name).primaryKeys() as number[];
    if(songkeys.length >= 1){
        const song = await local_songs_db.songs.where("id").equals(songkeys[0]).first();
        if(song !== undefined)startPlayingNewSong(song);
    }
    if(songkeys.length >= 2)playThisListNow(songkeys.slice(1), shuffle);
}

function setDiscordActivityWithTimestamps(song: Song | null, curr_poss_sec: number = -1){
    const discordConnectStatus = useSavedObjectStore.getState().local_store.AppActivityDiscord;
    if(discordConnectStatus === "No")return;

    if(curr_poss_sec === -1)curr_poss_sec = usePlayingPositionSec.getState().position;

    if(song !== null){
        invoke("set_discord_rpc_activity_with_timestamps", {
            name: song.name, 
            artist: song.artist, 
            durationAsNum: song.duration_seconds - curr_poss_sec,
            hasCover: song.cover_uuid !== null,
            id: song.id
        }).then().catch();
    }
    else invoke("clear_discord_rpc_activity").then().catch();
}

function setDiscordActivity(song: Song | null){
    const discordConnectStatus = useSavedObjectStore.getState().local_store.AppActivityDiscord;
    if(discordConnectStatus === "No")return;

    if(song !== null){
        invoke("set_discord_rpc_activity", {
            name: song.name, 
            artist: song.artist,
            hasCover: song.cover_uuid !== null,
            id: song.id
        }).then().catch();
    }
    else invoke("clear_discord_rpc_activity").then().catch();
}