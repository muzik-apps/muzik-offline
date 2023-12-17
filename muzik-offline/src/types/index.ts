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
    WallpaperOpacityAmount = "WallpaperOpacityAmount",
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
    id: number,
    title: string,
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
}

export interface artist {
    key: number;
    cover: string | null;
    artist_name: string;
}

export interface playlist {
    key: number;
    cover: string | null;
    title: string;
    dateCreated: string;
    tracksPaths: string[];
}

export interface genre {
    key: number;
    cover: string | null;
    title: string;
}

export interface album {
    key: number;
    cover: string | null;
    title: string;
}

export interface mouse_coOrds {
    xPos: number; 
    yPos: number;
}