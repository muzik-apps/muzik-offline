export enum selectedSettingENUM {
    General = "General",
    Appearance = "Appearance", 
    MusicFolders = "Music Folders",
    Security = "Security",
    ExportSongs = "Export Songs",
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
    SongLengthORremaining = "SongLengthORremaining",
    AlwaysRoundedCornersWindows = "AlwaysRoundedCornersWindows",
    AutoStartApp = "AutoStartApp",
}

export enum OSTYPEenum{
    Linux = 'linux', 
    macOS = 'macos', 
    Windows = 'windows',
    iOS = 'ios',
    Android = 'android'
}

export enum contextMenuEnum{
    ArtistCM = "ArtistCM",
    GenreCM = "GenreCM",
    PlaylistCM = "PlaylistCM",
    SongCM = "SongCM",
    AlbumCM = "AlbumCM",
    PlaylistSongsCM = "PlaylistSongsCM"
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
    Delete = "Delete",
    EditSong = "EditSong",
}

export enum toastType{
    success = "success",
    error = "error",
    info = "info",
    warning = "warning"
}

export enum playerState{
    Playing = "playing",
    Paused = "paused",
    Stopped = "stopped"
}

export interface toast{
    type: toastType;
    title: string;
    message: string;
    timeout: number;
}

export interface Song{
    id: number,
    uuid: string,
    title: string,
    name: string,
    artist: string,
    album: string,
    genre: string,
    year: number,
    duration: string,
    duration_seconds: number,
    path: string,
    cover_uuid: string | null,
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
    key: number;
    uuid: string;
    cover: string | null;
    artist_name: string;
}

export interface playlist {
    key: number;
    uuid: string;
    cover: string | null;
    title: string;
    dateCreated: string;
    dateEdited: string;
    tracksPaths: string[];
}

export interface genre {
    key: number;
    uuid: string;
    cover: string | null;
    title: string;
}

export interface album {
    key: number;
    uuid: string;
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

export interface Payload {
    event: string;
    seek_direction: string;
    duration?: number;
    volume?: number;
    uri?: string;
}

export interface wallpaper{
    key: number | undefined;
    uuid: string;
}

export enum AirplayCastResponseType {
    DevicesFound = "DevicesFound",
    Connected = "Connected",
    EnterPin = "EnterPin",
    Disconnected = "Disconnected",
    StreamingStarted = "StreamingStarted",
    Resumed = "Resumed",
    Paused = "Paused",
    Stopped = "Stopped",
    ConnectionFailed = "ConnectionFailed",
    PairingFailed = "PairingFailed",
    DisconnectionFailed = "DisconnectionFailed",
    StreamingFailed = "StreamingFailed",
    ResumingFailed = "ResumingFailed",
    PausingFailed = "PausingFailed",
    StoppingFailed = "StoppingFailed",
    UnknownCommand = "UnknownCommand",
    DiscoveryStoppingFailed = "DiscoveryStoppingFailed",
}

export type AirplayCastDevice = {
    id: string;
    name: string;
    model: string;
    address: string;
    loading: boolean;
    connected: boolean;
}

export type AirplayCastResponse = {
    status: "success" | "error";
    type: AirplayCastResponseType;
    message: string;
    data: AirplayCastDevice[];
}