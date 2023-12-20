import { Song, album, artist, genre, playlist } from 'types';
import Dexie, { Table } from 'dexie';

export class SongsDexie extends Dexie {
    // 'songs' are added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    songs!: Table<Song>;

    constructor() {
        super('SongsDatabase');
        this.version(1).stores({
            songs: 'id,title,name,artist,album,genre,year,duration,duration_seconds,path,cover,date_recorded,date_released,file_size,file_type' // Primary key and indexed props
        });
    }
}

export class AlbumsDexie extends Dexie {
    // 'albums' are added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    albums!: Table<album>;

    constructor() {
        super('AlbumsDatabase');
        this.version(1).stores({
            albums: 'key,cover,title' // Primary key and indexed props
        });
    }
}

export class ArtistsDexie extends Dexie {
    // 'artists' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    artists!: Table<artist>;

    constructor() {
        super('ArtistsDatabase');
        this.version(1).stores({
            artists: 'key,cover,artist_name' // Primary key and indexed props
        });
    }
}

export class GenresDexie extends Dexie {
    // 'Genres' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    genres!: Table<genre>;

    constructor() {
        super('GenresDatabase');
        this.version(1).stores({
            genres: 'key,cover,title' // Primary key and indexed props
        });
    }
}

export class PlaylistsDexie extends Dexie {
    // 'Playlists' are added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    playlists!: Table<playlist>;

    constructor() {
        super('PlaylistsDatabase');
        this.version(1).stores({
            playlists: 'key,cover,title,dateCreated,tracksPaths' // Primary key and indexed props
        });
    }
}

export const local_songs_db = new SongsDexie();
export const local_albums_db = new AlbumsDexie();
export const local_artists_db = new ArtistsDexie();
export const local_genres_db = new GenresDexie();
export const local_playlists_db = new PlaylistsDexie();