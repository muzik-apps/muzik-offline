import { NullCoverOne, NullCoverTwo, NullCoverThree, NullCoverFour } from "@assets/index";
import { local_albums_db, local_artists_db, local_genres_db, local_songs_db } from "@database/database";
import { Song, album } from "types";

export const createSongList_inDB = (SongList: Song[]) => {
    local_songs_db.songs.clear().then(() => {
        SongList.map(async(song) => await local_songs_db.songs.add(song));
    });
}

export const createAlbumsList_inDB = (SongList: Song[]) => {
    local_albums_db.albums.clear().then(() => {
        const uniqueMap: Map<string, {key: number, cover: string | null}> = new Map();

        SongList.map((song) => {
            if(!uniqueMap.has(song.album) && song.cover !== null){
                //if the album is not in the map and the cover is not null
                uniqueMap.set(song.album, {key: song.id, cover: song.cover});
            }
            else if(uniqueMap.has(song.album) && song.cover !== null && uniqueMap.get(song.album) === null){
                //if the album is in the map and the cover is not null and the cover is null in the map
                uniqueMap.set(song.album, {key: song.id, cover: song.cover});
            }
            else if(!uniqueMap.has(song.album) && song.cover === null){
                //if the album is not in the map and the cover is null
                uniqueMap.set(song.album, {key: song.id, cover: null});
            }
        });

        uniqueMap.forEach(async(value, key) => {
            await local_albums_db.albums.add({ key: value.key, cover: value.cover, title: key});
        });
    });
}

export const createArtistsList_inDB = (SongList: Song[]) => {
    local_artists_db.artists.clear().then(() => {
        const uniqueMap: Map<string, {key: number, cover: string | null}> = new Map();
    
        SongList.map((song) => {
            if(!uniqueMap.has(song.artist) && song.cover !== null){
                //if the artist is not in the map and the cover is not null
                uniqueMap.set(song.artist, {key: song.id, cover: song.cover});
            }
            else if(uniqueMap.has(song.artist) && song.cover !== null && uniqueMap.get(song.artist) === null){
                //if the artist is in the map and the cover is not null and the cover is null in the map
                uniqueMap.set(song.artist, {key: song.id, cover: song.cover});
            }
            else if(!uniqueMap.has(song.artist) && song.cover === null){
                //if the artist is not in the map and the cover is null
                uniqueMap.set(song.artist, {key: song.id, cover: null});
            }
        });
    
        uniqueMap.forEach(async(value, key) => {
            await local_artists_db.artists.add({ key: value.key, cover: value.cover, artist_name: key});
        });
    });
}

export const createGenresList_inDB = (SongList: Song[]) => {
    local_genres_db.genres.clear().then(() => {
        const uniqueMap: Map<string, {key: number, cover: string | null}> = new Map();
    
        SongList.map((song) => {
            if(!uniqueMap.has(song.genre) && song.cover !== null){
                //if the genre is not in the map and the cover is not null
                uniqueMap.set(song.genre, {key: song.id, cover: song.cover});
            }
            else if(uniqueMap.has(song.genre) && song.cover !== null && uniqueMap.get(song.genre) === null){
                //if the genre is in the map and the cover is not null and the cover is null in the map
                uniqueMap.set(song.genre, {key: song.id, cover: song.cover});
            }
            else if(!uniqueMap.has(song.genre) && song.cover === null){
                //if the genre is not in the map and the cover is null
                uniqueMap.set(song.genre, {key: song.id, cover: null});
            }
        });
    
        uniqueMap.forEach(async(value, key) => {
            await local_genres_db.genres.add({ key: value.key, cover: value.cover, title: key});
        });
    });
}

export function secondsToTimeFormat(totalSeconds: number) {
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return (days > 0 ? days + ':' : '') + padNumber(hours) + ':' + padNumber(minutes) + ':' + padNumber(seconds);
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