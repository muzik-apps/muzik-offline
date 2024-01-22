import { Song, album, artist, genre, playlist } from '@muziktypes/index';
import Dexie, { Table } from 'dexie';

const DATABASE_VERSION: number = 2;

export class SongsDexie extends Dexie {
    // 'songs' are added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    songs!: Table<Song>;

    constructor() {
        super('SongsDatabase');
        this.version(DATABASE_VERSION).stores({
            songs: 'id,title,name,artist,album,genre,year,duration,duration_seconds,path,cover,date_recorded,date_released,file_size,file_type,overall_bit_rate,audio_bit_rate,sample_rate,bit_depth,channels' // Primary key and indexed props
        }).upgrade(async (tx) => {
            //clean entire database
            await tx.table('songs').clear();
        });
    }
}

export class AlbumsDexie extends Dexie {
    // 'albums' are added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    albums!: Table<album>;

    constructor() {
        super('AlbumsDatabase');
        this.version(DATABASE_VERSION).stores({
            albums: 'key,cover,title' // Primary key and indexed props
        }).upgrade(async (tx) => {
            //clean entire database
            await tx.table('albums').clear();
        });
    }
}

export class ArtistsDexie extends Dexie {
    // 'artists' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    artists!: Table<artist>;

    constructor() {
        super('ArtistsDatabase');
        this.version(DATABASE_VERSION).stores({
            artists: 'key,cover,artist_name' // Primary key and indexed props
        }).upgrade(async (tx) => {
            //clean entire database
            await tx.table('artists').clear();
        });
    }
}

export class GenresDexie extends Dexie {
    // 'Genres' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    genres!: Table<genre>;

    constructor() {
        super('GenresDatabase');
        this.version(DATABASE_VERSION).stores({
            genres: 'key,cover,title' // Primary key and indexed props
        }).upgrade(async (tx) => {
            //clean entire database
            await tx.table('genres').clear();
        });
    }
}

export class PlaylistsDexie extends Dexie {
    // 'Playlists' are added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    playlists!: Table<playlist>;

    constructor() {
        super('PlaylistsDatabase');
        this.version(DATABASE_VERSION).stores({
            playlists: '++key,cover,title,dateCreated,dateEdited,tracksPaths' // Primary key and indexed props
        }).upgrade(async (tx) => {
            //clean entire database
            await tx.table('playlists').clear();
        });
    }
}

export const local_songs_db = new SongsDexie();
export const local_albums_db = new AlbumsDexie();
export const local_artists_db = new ArtistsDexie();
export const local_genres_db = new GenresDexie();
export const local_playlists_db = new PlaylistsDexie();