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
    ChartsCM = "ChartsCM",
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
    Favorite = "Favorite",
    UnFavorite = "UnFavorite",
    AddToPlaylist = "AddToPlaylist",
    ShowChart = "ShowChart",
    ShowGenre = "ShowGenre",
    ShowPlaylist = "ShowPlaylist",
    Heart = "Heart",
    UnHeart ="UnHeart",
    ShowAlbum = "ShowAlbum"
}

export interface songDetails {
    key: number;
    cover: string;
    songName: string;
    artist: string;
    explicitStatus: boolean;
    hearted: boolean
}

export interface artistDetails {
    key: number;
    cover: string;
    artist_name: string;
    favourited: boolean
}

export interface playlistDetails {
    key: number;
    cover: string;
    title: string;
    dateCreated: string;
}

export interface genreDetails {
    key: number;
    cover: string;
    title: string;
}

export interface albumDetails {
    key: number;
    cover: string;
    title: string;
    dateAdded: string;
    hearted: true;
}

export interface mouse_coOrds {
    xPos: number; 
    yPos: number;
}