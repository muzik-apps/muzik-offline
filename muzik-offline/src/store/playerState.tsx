import { Song } from "types";
import { usePlayerStore, useSavedObjectStore } from "store";
import { invoke } from "@tauri-apps/api";
import { SavedObject } from "@database/index";

const playerState = () => {
    const {local_store, setStore} = useSavedObjectStore((state) => { return { local_store: state.local_store, setStore: state.setStore}; });
    const {Player, setPlayer} = usePlayerStore((state) => { return { Player: state.Player, setPlayer: state.setPlayer}; });
    
    async function startPlayingNewSong(song: Song){
        const temp = Player;
        temp.playingSongMetadata = song;
        temp.lengthOfSongInSeconds = song.duration_seconds;
        temp.isPlaying = true;
        await invoke("load_and_play_song_from_path", { soundPath: song.path });
        setPlayer(temp);
    }

    async function playSong(){
        if(Player.playingSongMetadata){
            await invoke("resume_playing");
            let temp = Player;
            temp.isPlaying = true;
            temp.wasPlayingBeforePause = true;
            setPlayer(temp);
        }
    }

    async function pauseSong(){
        if(Player.playingSongMetadata){
            await invoke("pause_song");
            let temp = Player;
            temp.isPlaying = false;
            temp.wasPlayingBeforePause = false;
            setPlayer(temp);
        }
    }

    async function dragSeeker(){
        //that value is bounded between 0 and 100
        if(Player.playingSongMetadata === null)return;
        if(Player.isPlaying === false)return;
        await pauseSong();
        let temp = Player;
        temp.wasPlayingBeforePause = true;
        setPlayer(temp);
    }

    function changeSeekerPosition(value: number){
        if(Player.playingSongMetadata === null)return;
        const position = (value / 100) * Player.lengthOfSongInSeconds;
        invoke("seek_to", {position: position}).then(() => {if(Player.wasPlayingBeforePause === true)playSong()})
    }

    function changeVolumeLevel(value: number){
        //that value is bounded between 0 and 100
        let temp: SavedObject = local_store;
        temp.Volume = value;
        setStore(temp);
    }

    function changeVolumeLevelBtnPress(isDecreasing: boolean){
        if(isDecreasing === true){
            const level: number = (local_store.Volume - parseInt(local_store.VolumeStepAmount));
            let temp: SavedObject = local_store;
            temp.Volume = level <= 0 ? 0 : level;
            setStore(temp);
        }
        else{
            const level: number = (local_store.Volume + parseInt(local_store.VolumeStepAmount));
            let temp: SavedObject = local_store;
            temp.Volume = level >= 100 ? 100 : level;
            setStore(temp);
        }
    }

    function shuffleToggle(){
        let temp = Player;
        temp.isShuffling = !Player.isShuffling;
        setPlayer(temp);
    }

    function repeatToggle(){
        let temp = Player;
        temp.repeatingLevel = Player.repeatingLevel + 1 > 2 ? 0 : (Player.repeatingLevel + 1) as 0 | 1 | 2;
        setPlayer(temp);
    }

    return {
        Player,
        playSong: playSong,
        pauseSong: pauseSong,
        repeatToggle: repeatToggle,
        shuffleToggle: shuffleToggle,
        startPlayingNewSong: startPlayingNewSong,
        dragSeeker: dragSeeker,
        changeSeekerPosition: changeSeekerPosition,
        changeVolumeLevel: changeVolumeLevel,
        changeVolumeLevelBtnPress: changeVolumeLevelBtnPress
    }
}

export default playerState