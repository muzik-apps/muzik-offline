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
    WallpaperBlurOrOpacity: "blur" | "opacity",
    OStype: string,
    CompressImage: string,
    UpcomingHistoryLimit: string,
    SeekStepAmount: string,
    SongLengthORremaining: string,
    AudioLabPreset: string,
    SavedPresets: string[],
    AlwaysRoundedCornersWindows: string,
    AutoStartApp: string,
    DirectoryScanningDepth: number,
    player: "rodio" | "kira",
    AudioQuality: string,
    PlayBackSpeed: string,
    AudioTransition: string,
    OutputDevice: string
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
    WallpaperBlurOrOpacity: "opacity",
    OStype: OSTYPEenum.Windows,
    CompressImage: "No",
    UpcomingHistoryLimit: "10",
    SeekStepAmount: "10",
    SongLengthORremaining: "song length",
    AudioLabPreset: "flat",
    SavedPresets: ["flat", "hip-hop"],
    AlwaysRoundedCornersWindows: "No",
    AutoStartApp: "No",
    DirectoryScanningDepth: 1,
    player: "rodio",
    AudioQuality: "High(320kbps)",
    PlayBackSpeed: "1",
    AudioTransition: "No",
    OutputDevice: ""
}

export function resetObject(obj: SavedObject){
    obj.LaunchTab = "All tracks";
    obj.AppActivityDiscord = "No";
    obj.BGColour = "blue_purple_gradient";
    obj.ThemeColour = "blueberry";
    obj.PlayerBar = true;
    obj.Volume = 0;
    obj.VolumeStepAmount = "5";
    obj.SongSeeker = 0;
    obj.Animations = false;
    obj.AppThemeBlur = true;
    obj.WallpaperOpacityAmount = "8";
    obj.OStype = OSTYPEenum.Windows;
    obj.CompressImage = "No";
    obj.UpcomingHistoryLimit = "10";
    obj.SeekStepAmount = "10";
    obj.SongLengthORremaining = "song length";
    obj.AudioLabPreset = "flat";
    obj.SavedPresets = ["flat", "hip-hop"];
    obj.AlwaysRoundedCornersWindows = "No";
    obj.AutoStartApp = "No";
    obj.DirectoryScanningDepth = 1;
    obj.player = "rodio";
    obj.AudioQuality = "High(320kbps)";
    obj.PlayBackSpeed = "1";
    obj.AudioTransition = "No";
    obj.OutputDevice = "";

    return obj;
}