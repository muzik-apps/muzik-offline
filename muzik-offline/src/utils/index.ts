import { NullCoverOne, NullCoverTwo, NullCoverThree, NullCoverFour } from "@assets/index";
import { local_albums_db, local_artists_db, local_genres_db, local_songs_db } from "@database/database";
import { Song, album, artist, genre, playlist } from "types";
import { invoke } from "@tauri-apps/api";

export const fetch_metadata_in_chunks = async() => {
    //fetch songs in bulk
    let last_song_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_songs", {batchSize: 50, lastId: last_song_id});
        const songs: Song[] = JSON.parse(res);
        if(res.length === 0)break;
        else await local_songs_db.songs.bulkAdd(songs);
        last_song_id = songs[songs.length - 1].id;
    }

    //fetch albums in bulk
    let last_album_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_albums", {batchSize: 50, lastId: last_album_id});
        const albums: album[] = JSON.parse(res);
        if(res.length === 0)break;
        else await local_albums_db.albums.bulkAdd(albums);
        last_album_id = albums[albums.length - 1].key;
    }

    //fetch artists in bulk
    let last_artist_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_artists", {batchSize: 50, lastId: last_artist_id});
        const artists: artist[] = JSON.parse(res);
        if(res.length === 0)break;
        else await local_artists_db.artists.bulkAdd(artists);
        last_artist_id = artists[artists.length - 1].key;
    }

    //fetch genres in bulk
    let last_genre_id = 0;
    while(true){
        const res: any = await invoke("get_batch_of_genres", {batchSize: 50, lastId: last_genre_id});
        const genres: genre[] = JSON.parse(res);
        if(res.length === 0)break;
        else await local_genres_db.genres.bulkAdd(genres);
        last_genre_id = genres[genres.length - 1].key;
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