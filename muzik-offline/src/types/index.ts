export enum selectedSettingENUM {
    General = "General",
    Appearance = "Appearance", 
    Security = "Security",
    Advanced = "Advanced",
    About = "About"
}

export enum selectedGeneralSettingEnum{
    Nothing = "Nothing",
    LaunchTab = "LaunchTab",
    AppActivityDiscord = "AppActivityDiscord",
    VolumeStepAmount = "VolumeStepAmount",
    CompressImage = "CompressImage",
    UpcomingHistoryLimit = "UpcomingHistoryLimit",
    SeekStepAmount = "SeekStepAmount",
    SongLengthORremaining = "SongLengthORremaining"
}

export enum OSTYPEenum{
    Linux = 'Linux', 
    macOS = 'Darwin', 
    Windows = 'Windows_NT'
}

export enum contextMenuEnum{
    ArtistCM = "ArtistCM",
    GenreCM = "GenreCM",
    PlaylistCM = "PlaylistCM",
    SongCM = "SongCM",
    AlbumCM = "AlbumCM"
}

export enum contextMenuButtons{
    Play = "Play",
    PlayNext = "PlayNext",
    PlayLater = "PlayLater",
    ShowArtist = "ShowArtist",
    AddToPlaylist = "AddToPlaylist",
    ShowGenre = "ShowGenre",
    ShowPlaylist = "ShowPlaylist",
    ShowAlbum = "ShowAlbum",
    ShowInfo = "ShowInfo",
}

export enum toastType{
    success = "success",
    error = "error",
    info = "info",
    warning = "warning"
}

export interface toast{
    type: toastType;
    title: string;
    message: string;
    timeout: number;
}

export interface Song{
    id: string,
    title: string,
    name: string,
    artist: string,
    album: string,
    genre: string,
    year: number,
    duration: string,
    duration_seconds: number,
    path: string,
    cover: string | null,
    date_recorded: string,
    date_released: string,
    file_size: number,
    file_type: string,
    overall_bit_rate: number,
    audio_bit_rate: number,
    sample_rate: number,
    bit_depth: number,
    channels: number
}

export interface artist {
    key: string;
    cover: string | null;
    artist_name: string;
}

export interface playlist {
    key: number;
    cover: any | null;
    title: string;
    dateCreated: string;
    dateEdited: string;
    tracksPaths: string[];
}

export interface genre {
    key: string;
    cover: string | null;
    title: string;
}

export interface album {
    key: string;
    cover: string | null;
    title: string;
}

export interface mouse_coOrds {
    xPos: number; 
    yPos: number;
}

export interface AlbumMD {
    cover: string | null;
    title: string;
    artist: string;
    year: string;
    song_count: number;
    length: string;
}

export interface ArtistMD {
    cover: string | null;
    artistName: string;
    album_count: number;
    song_count: number;
    length: string;
}

export interface GenreMD {
    cover: string | null;
    genreName: string;
    song_count: number;
    length: string;
}

export interface PlaylistMD {
    playlist_data: playlist | null,
    song_count: number;
    length: string;
}