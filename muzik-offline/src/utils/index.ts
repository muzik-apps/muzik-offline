import { NullCoverOne, NullCoverTwo, NullCoverThree, NullCoverFour } from "@assets/index";
import { local_albums_db, local_artists_db, local_genres_db, local_playlists_db, local_songs_db } from "@database/database";
import { Song, album, artist, genre, playlist } from "@muziktypes/index";
import { invoke } from "@tauri-apps/api";
const batch_size: number = 50;

export const fetch_library_in_chunks = async(): Promise<{status: string, message: string}> => {
    const res_songs = await fetch_songs_metadata_in_chunks();
    if(res_songs.status === "error")return res_songs;

    const res_albums = await fetch_albums_metadata_in_chunks();
    if(res_albums.status === "error")return res_albums;


    const res_artists = await fetch_artists_metadata_in_chunks();
    if(res_artists.status === "error")return res_artists;

    const res_genres = await fetch_genres_metadata_in_chunks();
    if(res_genres.status === "error")return res_genres;

    return {status: "success", message: ""};
}

export const fetch_songs_metadata_in_chunks = async(): Promise<{status: string, message: string}> => {
    //fetch songs in bulk
    let last_song_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_songs", {batchSize: batch_size, lastId: last_song_id});
        const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
        if(responseobject.status === "success"){
            const songs: Song[] = responseobject.data;
            if(songs.length < batch_size){
                await local_songs_db.songs.bulkAdd(songs);
                return {status: "success", message: ""};
            }
            else{ 
                await local_songs_db.songs.bulkAdd(songs);
                last_song_id = songs[songs.length - 1].id + 1;
            }
        }
        else{ return {status: "error", message: "failed to retrieve songs, please try again"}; }
    } 
}

export const fetch_albums_metadata_in_chunks = async(): Promise<{status: string, message: string}> => {
    let last_album_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_albums", {batchSize: batch_size, lastId: last_album_id});
        const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
        if(responseobject.status === "success"){
            const albums: album[] = responseobject.data;
            if(albums.length < batch_size){
                await local_albums_db.albums.bulkAdd(albums);
                return {status: "success", message: ""};
            }
            else{ 
                await local_albums_db.albums.bulkAdd(albums);
                last_album_id = albums[albums.length - 1].key + 1;
            }
        }
        else{ return {status: "error", message: "failed to retrieve albums, please try again"}; }
    }
}

export const fetch_artists_metadata_in_chunks = async(): Promise<{status: string, message: string}> => {
    let last_artist_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_artists", {batchSize: batch_size, lastId: last_artist_id});
        const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
        if(responseobject.status === "success"){
            const artists: artist[] = responseobject.data;
            if(artists.length < batch_size){
                await local_artists_db.artists.bulkAdd(artists);
                return {status: "success", message: ""};
            }
            else{ 
                await local_artists_db.artists.bulkAdd(artists);
                last_artist_id = artists[artists.length - 1].key + 1;
            }
        }
        else{ return {status: "error", message: "failed to retrieve albums, please try again"}; }
    }
}

export const fetch_genres_metadata_in_chunks = async(): Promise<{status: string, message: string}> => {
    let last_genre_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_genres", {batchSize: batch_size, lastId: last_genre_id});
        const responseobject: {status: string, message: string, data: []} = JSON.parse(res);
        if(responseobject.status === "success"){
            const genres: genre[] = responseobject.data;
            if(genres.length < batch_size){
                await local_genres_db.genres.bulkAdd(genres)
                return {status: "success", message: ""};
            }
            else{ 
                local_genres_db.genres.bulkAdd(genres);
                last_genre_id = genres[genres.length - 1].key + 1;
            }
        }
        else{ return {status: "error", message: "failed to retrieve albums, please try again"}; }
    }
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
        if(cover === null && song.cover)cover = song.cover;
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
        if(cover === null && song.cover)cover = song.cover;
    });
    return { songs, totalDuration, cover };
}

export const getPlaylistSongs = async(res: playlist): Promise<{ songs: Song[]; totalDuration: number; cover: string | null;}> => {
    const playlistSongs: Song[] = await local_songs_db.songs.where("path").anyOf(res.tracksPaths).toArray();
    let totalDuration = 0;
    const songs: Song[] = [];
    let cover: string | null = null;
    playlistSongs.forEach((song) => {
        totalDuration += song.duration_seconds;
        songs.push(song);
        if(cover === null && song.cover)cover = song.cover;
    });
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
        if(cover === null && song.cover)cover = song.cover;
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