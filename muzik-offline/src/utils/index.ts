import { local_albums_db, local_artists_db, local_genres_db, local_songs_db } from "@database/database";
import { Song } from "types";

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