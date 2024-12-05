import { AudioLabPreset } from '@muziktypes/index';
export const variants_list = {smaller: { height: "calc(100vh - 395px)" },bigger: { height: "calc(100vh - 195px)" }}

export const modal_variants = {
    open: { opacity: 1, scale: 1},
    closed: { opacity: 0, scale: 0.6},
}

const premade_audio_labs: Map<string, AudioLabPreset> = new Map();
premade_audio_labs.set("flat", {
    SixtyTwoHz: 50,
    OneTwentyFiveHz: 50,
    TwoFiftyHz: 50,
    FiveHundredHz: 50,
    OnekHz: 50,
    TwokHz: 50,
    FourkHz: 50,
    EightkHz: 50,
    SixteenkHz: 50,
});
premade_audio_labs.set("hip-hop", {
    SixtyTwoHz: 75,
    OneTwentyFiveHz: 100,
    TwoFiftyHz: 50,
    FiveHundredHz: 50,
    OnekHz: 50,
    TwokHz: 50,
    FourkHz: 50,
    EightkHz: 50,
    SixteenkHz: 50,
});

export { premade_audio_labs };