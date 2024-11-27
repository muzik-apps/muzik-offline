import { OSTYPEenum } from "@muziktypes/index";

export interface SavedObject{
    LaunchTab: string,
    AppActivityDiscord: string,
    BGColour: string,
    ThemeColour: string,
    PlayerBar: boolean,
    Volume: number,
    VolumeStepAmount: string,
    SongSeeker: number,
    Animations: boolean,
    AppThemeBlur: boolean,
    WallpaperOpacityAmount: string,
    OStype: string,
    CompressImage: string,
    UpcomingHistoryLimit: string,
    SeekStepAmount: string,
    SongLengthORremaining: string,
    AlwaysRoundedCornersWindows: string,
    AutoStartApp: string,
    DirectoryScanningDepth: number
}

export const emptySavedObject: SavedObject = {
    LaunchTab: "All tracks",
    AppActivityDiscord: "No",
    BGColour: "blue_purple_gradient",
    ThemeColour: "blueberry",
    PlayerBar: true,
    Volume: 0,
    VolumeStepAmount: "5",
    SongSeeker: 0,
    Animations: false,
    AppThemeBlur: true,
    WallpaperOpacityAmount: "8",
    OStype: OSTYPEenum.Windows,
    CompressImage: "No",
    UpcomingHistoryLimit: "10",
    SeekStepAmount: "10",
    SongLengthORremaining: "song length",
    AlwaysRoundedCornersWindows: "No",
    AutoStartApp: "No",
    DirectoryScanningDepth: 1
}