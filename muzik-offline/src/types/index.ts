export enum selectedSettingENUM {
    General = "General",
    Appearance = "Appearance", 
    AudioLab = "AudioLab",
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
    AudioLabPreset = "AudioLabPreset",
    AlwaysRoundedCornersWindows = "AlwaysRoundedCornersWindows",
    AutoStartApp = "AutoStartApp",
    AudioQuality = "AudioQuality",
    PlayBackSpeed = "PlayBackSpeed",
    AudioTransition = "AudioTransition",
    OutputDevice = "OutputDevice"
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
    Remove = "Remove"
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

export interface AudioLabPreset{
    SixtyTwoHz: number;
    OneTwentyFiveHz: number;
    TwoFiftyHz: number;
    FiveHundredHz: number;
    OnekHz: number;
    TwokHz: number;
    FourkHz: number;
    EightkHz: number;
    SixteenkHz: number;
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