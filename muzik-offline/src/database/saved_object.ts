import { OSTYPEenum } from "types";

export interface SavedObject{
    StreamingSource: string,
    LaunchTab: string,
    FriendList: string,
    SongHistory: string,
    RightSideBar: string,
    AppActivityDiscord: string,
    PrivacyStatus: boolean,
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
    StreamingSource: "Online Streaming",
    LaunchTab: "Home page",
    FriendList: "Yes",
    SongHistory: "Yes",
    RightSideBar: "Yes",
    AppActivityDiscord: "No",
    PrivacyStatus: true,
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