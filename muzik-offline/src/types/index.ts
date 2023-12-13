export enum selectedSettingENUM {
    General = "General",
    Account = "Account",
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

export interface Song{
    id: number,
    title: string,
    artist: string,
    album: string,
    genre: string,
    year: number,
    duration: string,
    path: string,
    cover: string,
    date_recorded: string,
    date_released: string,
    file_size: number,
    file_type: string,
}

export interface artistDetails {
    key: number;
    cover: string;
    artist_name: string;
    favourited: boolean
}

export interface playlist {
    key: number;
    cover: string;
    title: string;
    dateCreated: string;
    tracksPaths: string[];
}

export interface genreDetails {
    key: number;
    cover: string;
    title: string;
}

export interface album {
    key: number;
    cover: string;
    title: string;
}

export interface mouse_coOrds {
    xPos: number; 
    yPos: number;
}