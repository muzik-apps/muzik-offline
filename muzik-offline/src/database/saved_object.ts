import { OSTYPEenum } from "types";

export interface SavedObject{
    LaunchTab: string,
    AppActivityDiscord: string,
    BGColour: string,
    ThemeColour: string,
    PlayerBar: boolean,
    Volume: number,
    VolumeStepAmount: string,
    SongSeeker: number,
    AnimateBackground: boolean,
    AppThemeBlur: boolean,
    WallpaperOpacityAmount: string,
    OStype: string
}

export const emptySavedObject: SavedObject = {
    LaunchTab: "Home page",
    AppActivityDiscord: "No",
    BGColour: "black_linear",
    ThemeColour: "blueberry",
    PlayerBar: true,
    Volume: 0,
    VolumeStepAmount: "5",
    SongSeeker: 0,
    AnimateBackground: true,
    AppThemeBlur: true,
    WallpaperOpacityAmount: "8",
    OStype: OSTYPEenum.Windows
}