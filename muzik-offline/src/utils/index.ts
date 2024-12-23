import { NullCoverOne, NullCoverTwo, NullCoverThree, NullCoverFour } from "@assets/index";
import { local_albums_db, local_artists_db, local_genres_db, local_playlists_db, local_songs_db } from "@database/database";
import { Song, album, artist, genre, playlist } from "@muziktypes/index";
import { useDirStore, useFisrstRunStore, useHistorySongs, usePortStore, useSavedObjectStore, useToastStore, useUpcomingSongs, useVersionStore, useViewableSideElStore, useWallpaperStore } from "@store/index";
import { invoke } from "@tauri-apps/api/core";
import { toastType } from '../types/index';
import { getVersion } from "@tauri-apps/api/app";
import { resetObject } from "@database/saved_object";
import { resetViewableElements } from "@database/side_elements";

export const fetch_library = async(fresh_library: boolean): Promise<{status: string, message: string}> => {
    const res_songs = await fetch_songs_metadata(fresh_library);
    if(res_songs.status === "error")return res_songs;

    const res_albums = await fetch_albums_metadata(fresh_library);
    if(res_albums.status === "error")return res_albums;


    const res_artists = await fetch_artists_metadata(fresh_library);
    if(res_artists.status === "error")return res_artists;

    const res_genres = await fetch_genres_metadata(fresh_library);
    if(res_genres.status === "error")return res_genres;

    return {status: "success", message: ""};
}

export const fetch_songs_metadata = async(fresh_library: boolean): Promise<{status: string, message: string}> => {
    let res: any;
    if(fresh_library){
        res = await invoke("get_all_songs_in_db");
    } else{
        const local_songs = await local_songs_db.songs.toArray();
        const uuids = local_songs.map((song) => song.uuid);
        res = await invoke("get_songs_not_in_vec", {uuidsNotToMatch: uuids});
    }

    const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
    if(responseobject.status === "success"){
        const songs: Song[] = responseobject.data;
        await local_songs_db.songs.bulkAdd(songs);
        return {status: "success", message: ""};
    } else { return {status: "error", message: "failed to retrieve songs, please try again"}; }
}

export const fetch_albums_metadata = async(fresh_library: boolean): Promise<{status: string, message: string}> => {
    let res: any;
    if(fresh_library){
        res = await invoke("get_all_albums");
    } else{
        const local_albums = await local_albums_db.albums.toArray();
        const uuids = local_albums.map((album) => album.uuid);
        res = await invoke("get_albums_not_in_vec", {uuidsNotToMatch: uuids});
    }

    const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
    if(responseobject.status === "success"){
        const albums: album[] = responseobject.data;
        await local_albums_db.albums.bulkAdd(albums);
        return {status: "success", message: ""};
    } else { return {status: "error", message: "failed to retrieve albums, please try again"}; }
}

export const fetch_artists_metadata = async(fresh_library: boolean): Promise<{status: string, message: string}> => {
    let res: any;
    if(fresh_library){
        res = await invoke("get_all_artists");
    } else{
        const local_artists = await local_artists_db.artists.toArray();
        const uuids = local_artists.map((artist) => artist.uuid);
        res = await invoke("get_artists_not_in_vec", {uuidsNotToMatch: uuids});
    }

    const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
    if(responseobject.status === "success"){
        const artists: artist[] = responseobject.data;
        await local_artists_db.artists.bulkAdd(artists);
        return {status: "success", message: ""};
    } else { return {status: "error", message: "failed to retrieve albums, please try again"}; }
}

export const fetch_genres_metadata = async(fresh_library: boolean): Promise<{status: string, message: string}> => {
    let res: any;
    if(fresh_library){
        res = await invoke("get_all_genres");
    } else{
        const local_genres = await local_genres_db.genres.toArray();
        const uuids = local_genres.map((genre) => genre.uuid);
        res = await invoke("get_genres_not_in_vec", {uuidsNotToMatch: uuids});
    }

    const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
    if(responseobject.status === "success"){
        const genres: genre[] = responseobject.data;
        await local_genres_db.genres.bulkAdd(genres);
        return {status: "success", message: ""};
    } else { return {status: "error", message: "failed to retrieve albums, please try again"}; }
}

export function secondsToTimeFormat(totalSeconds: number) {
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return (days > 0 ? days + ':' : '') + (hours > 0 ? padNumber(hours) + ':' : '') + padNumber(minutes) + ':' + padNumber(seconds);
}

function padNumber(num: number) { return num.toString().padStart(2, '0'); }

export const getAlbumSongs = async(res: album, artist_name: string): Promise<{ songs: Song[]; totalDuration: number; cover: string | null;}> => {
    let albumSongs: Song[] = [];
    if(artist_name === ""){
        albumSongs = await local_songs_db.songs.where("album").equals(res.title).toArray();
    }
    else{
        albumSongs = await local_songs_db.songs.where({ album: res.title, artist: artist_name }).toArray();
    }

    let totalDuration = 0;
    const songs: Song[] = [];
    let cover: string | null = null;
    albumSongs.forEach((song) => {
        totalDuration += song.duration_seconds;
        songs.push(song);
        if(cover === null && song.cover_uuid)cover = song.cover_uuid;
    });
    return { songs, totalDuration, cover };
}

export const getGenreSongs = async(res: genre): Promise<{ songs: Song[]; totalDuration: number; cover: string | null;}> => {
    const genreSongs: Song[] = await local_songs_db.songs.where("genre").equals(res.title).toArray();
    let totalDuration = 0;
    const songs: Song[] = [];
    let cover: string | null = null;
    genreSongs.forEach((song) => {
        totalDuration += song.duration_seconds;
        songs.push(song);
        if(cover === null && song.cover_uuid)cover = song.cover_uuid;
    });
    return { songs, totalDuration, cover };
}

export const getPlaylistSongs = async(res: playlist): Promise<{ songs: Song[]; totalDuration: number; cover: string | null;}> => {
    const playlistSongs: Song[] = await local_songs_db.songs.where("path").anyOf(res.tracksPaths).toArray();
    let totalDuration = 0;
    const pathIndexMap: Record<string, number> = {};
    let cover: string | null = null;
    playlistSongs.forEach((song, index) => {
        totalDuration += song.duration_seconds;
        pathIndexMap[song.path] = index;
        if(cover === null && song.cover_uuid)cover = song.cover_uuid;
    });
    
    const songs: Song[] = res.tracksPaths.map((path) => {return playlistSongs[pathIndexMap[path]]});
    return { songs, totalDuration, cover };
}

export const getArtistsAlbums = async(artist_name: string): Promise<{ albums: album[]; totalDuration: number; cover: string | null; song_count: number}> => {
    const artistSongs: Song[] = await local_songs_db.songs.where("artist").equals(artist_name).toArray();
    let totalDuration = 0;
    let cover: string | null = null;

    const uniqueSet: Set<string> = new Set();
    artistSongs.forEach((song) => {
        totalDuration += song.duration_seconds;
        if(!uniqueSet.has(song.album))uniqueSet.add(song.album);
        if(cover === null && song.cover_uuid)cover = song.cover_uuid;
    });

    const albums: album[] = await local_albums_db.albums.where('title').anyOf([...uniqueSet]).toArray();
    return { albums, totalDuration, cover, song_count: artistSongs.length };
}

export const getRandomCover = (value: number): () => JSX.Element => {
    const modv: number = value % 4;
    if(modv === 0)return NullCoverOne;
    else if(modv === 1)return NullCoverTwo;
    else if(modv === 2)return NullCoverThree;
    else return NullCoverFour;
}

export const getNullRandomCover = (value: number): string => {
    const modv: number = value % 4;
    if(modv === 0)return "NULL_COVER_ONE";
    else if(modv === 1)return "NULL_COVER_TWO";
    else if(modv === 2)return "NULL_COVER_THREE";
    else return "NULL_COVER_FOUR";
}

export const getCoverURL = (uuid: string): string => {
    const port = usePortStore.getState().port;
    return `http://localhost:${port}/image/${uuid}`;
}

export const getThumbnailURL = (uuid: string): string => {
    const port = usePortStore.getState().port;
    return `http://localhost:${port}/thumbnail/${uuid}`;
}

export const getWallpaperURL = (uuid: string): string => {
    const port = usePortStore.getState().port;
    return `http://localhost:${port}/wallpaper/${uuid}`;
}

export const getSongPaths = async(
    values: {album?: string, artist?: string, genre?: string, playlist?: string}
): Promise<string[]> => {
    if(values.playlist === undefined){
        const result: {album?: string, artist?: string, genre?: string} = {};
        
        if(values.album !== undefined)result.album = values.album;
        if(values.artist !== undefined)result.artist = values.artist;
        if(values.genre !== undefined)result.genre = values.genre;
        const songs = await local_songs_db.songs.where(result).toArray();
        return (songs.map((song) => {return song.path}));
    }
    else{
        const playlist = await local_playlists_db.playlists.where("title").equals(values.playlist).first();
        if(playlist === undefined)return [];
        return playlist.tracksPaths;
    }
}

export const reorderArray = (array: any[], from: number, to: number): any[] => {
    const newArray = [...array];
    const [removed] = newArray.splice(from, 1);
    newArray.splice(to, 0, removed);
    return newArray;
}

export function onDragEnd(newOrder: Song[], queueType: "SongHistory" | "SongQueue"){

    const songs_queue = newOrder.map((song) => song.id);

    if(queueType === "SongQueue")useUpcomingSongs.getState().setQueue(songs_queue);
    else useHistorySongs.getState().setQueue(songs_queue);
}

export async function onDragEndInPlaylistView(SongList: Song[], playlistKey: number): Promise<void>{
    const playlistobj = await local_playlists_db.playlists.where("key").equals(playlistKey).first();
    if(playlistobj === undefined)return;
    //extract track paths
    playlistobj.tracksPaths = SongList.map((song) => song.path);

    await local_playlists_db.playlists.update(playlistKey, playlistobj);
}

export function areArraysDifferent(array1: string[], array2: string[]) {
    // Check if arrays have different lengths
    if (array1.length !== array2.length)return true;

    // Check if any item is not present in both arrays
    return array1.some(item => !array2.includes(item));
}

export function getSongFieldsArray(selectedFields: Set<string>): string[] {
    const fields: string[] = [];
    if(selectedFields.has("title"))fields.push("title");
    if(selectedFields.has("artist"))fields.push("artist");
    if(selectedFields.has("album"))fields.push("album");
    if(selectedFields.has("genre"))fields.push("genre");
    if(selectedFields.has("year"))fields.push("year");
    if(selectedFields.has("duration"))fields.push("duration");
    if(selectedFields.has("path"))fields.push("path");
    if(selectedFields.has("date_recorded"))fields.push("date_recorded");
    if(selectedFields.has("date_released"))fields.push("date_released");
    if(selectedFields.has("file_size"))fields.push("file_size");
    if(selectedFields.has("file_type"))fields.push("file_type");
    if(selectedFields.has("overall_bit_rate"))fields.push("overall_bit_rate");
    if(selectedFields.has("audio_bit_rate"))fields.push("audio_bit_rate");
    if(selectedFields.has("sample_rate"))fields.push("sample_rate");
    if(selectedFields.has("bit_depth"))fields.push("bit_depth");
    if(selectedFields.has("channels"))fields.push("channels");
    return fields;
}

export function isInArray(check: string[], container: string[]): boolean {
    return check.every((item) => container.includes(item));
}

export async function reloadLibrary(paths: string[]){
    //check paths only contain directories
    let dirs = useDirStore.getState().dir.Dir;

    if(isInArray(paths, Array.from(dirs))){
        useToastStore.getState().setToast({title: "Cannot load songs...", message: "You are trying to reload a path that is already loaded", type: toastType.error, timeout: 5000});
        return;
    }

    useToastStore.getState().setToast({title: "Loading songs...", message: "We are searching for new songs", type: toastType.info, timeout: 5000});

    // add new paths to the existing paths
    paths.forEach((path) => {
        if(!dirs.has(path))dirs.add(path);
    });
    const local_store = useSavedObjectStore.getState().local_store;

    invoke("get_all_songs", { 
        pathsAsJsonArray: JSON.stringify(Array.from(dirs)), 
        compressImageOption: local_store.CompressImage === "Yes" ? true : false,
        maxDepth: local_store.DirectoryScanningDepth
    })
    .then(async() => {
        useDirStore.getState().setDir({Dir: dirs});
        await local_songs_db.songs.clear();
        await local_albums_db.albums.clear();
        await local_artists_db.artists.clear();
        await local_genres_db.genres.clear();

        const res = await fetch_library(true);
        let message = "";

        if(res.status === "error")message = res.message;
        else message = "Successfully loaded all the songs in the paths specified. You may need to reload the page you are on to see your new songs";

        useToastStore.getState().setToast({title: "Loading songs...", message: message, type: toastType.success, timeout: 5000});
    })
    .catch((_error) => {
        console.log(_error);
        useToastStore.getState().setToast({title: "Loading songs...", message: "No new songs detected in given folders or you dropped a file", type: toastType.error, timeout: 5000});
    });
}

export const shouldClearZustandStores = async() => {
    const savedAppVersion = useVersionStore.getState().version;
    const currentVersion = await getVersion();

    if(savedAppVersion === currentVersion)return;

    useVersionStore.getState().setVersion(currentVersion);
    useFisrstRunStore.getState().reset();
    useWallpaperStore.getState().reset();
    useViewableSideElStore.getState().setviewableEl(resetViewableElements(useViewableSideElStore.getState().viewableEl));
    useDirStore.getState().setDir({Dir: new Set<string>()});
    useSavedObjectStore.getState().setStore(resetObject(useSavedObjectStore.getState().local_store));

    await local_songs_db.songs.clear();
    await local_albums_db.albums.clear();
    await local_artists_db.artists.clear();
    await local_genres_db.genres.clear();

    useToastStore.getState().setToast({title: "App updated", message: "We have updated the app to a new version, please reload the app to see the changes", type: toastType.info, timeout: 5000});
}

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}