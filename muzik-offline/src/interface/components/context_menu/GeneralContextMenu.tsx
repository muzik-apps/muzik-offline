import { contextMenuButtons, contextMenuEnum } from "@muziktypes/index";
import { FunctionComponent } from "react";
import { AddToPlaylistButton, PlayButton,
    PlayLaterButton, PlayNextButton, ShowArtistButton, 
    ShowGenreButton, ShowPlaylistButton, 
    ShowAlbumButton, ShowInfoButton,
    DeleteButton, EditSongButton} from "@components/index";
import "@styles/components/context_menu/GeneralContextMenu.scss";
import { motion } from "framer-motion";

type GeneralContextMenuProps = {
    xPos: number;
    overRideX?: boolean;
    overRideY?: boolean;
    yPos: number;
    title: string;
    CMtype: contextMenuEnum;
    chooseOption: (option: contextMenuButtons) => void;
}

const GeneralContextMenu: FunctionComponent<GeneralContextMenuProps> = (props: GeneralContextMenuProps) => {
    function getXCoord(xPos: number){
        const winWidth: number = window.innerWidth - 20;
        const scmWidth: number = 155;
        if(props.overRideX)return xPos;
        else return xPos > winWidth - scmWidth ? (xPos - 174) : xPos;
    }

    function getYCoord(yPos: number){
        const winHeight: number = window.innerHeight - 35;
        let scmHeight: number = 0;
        if(props.CMtype === contextMenuEnum.GenreCM){//4 items
            scmHeight = 210;
        }
        //else if(){//5 items
        //    scmHeight = 250;
        //}
        else if(props.CMtype === contextMenuEnum.ArtistCM || props.CMtype === contextMenuEnum.AlbumCM
            || props.CMtype === contextMenuEnum.PlaylistSongsCM || props.CMtype === contextMenuEnum.SongCM){//6 items
            scmHeight = 280;
        }
        else if(props.CMtype === contextMenuEnum.PlaylistCM){//7 items
            scmHeight = 310;
        }
        if(props.overRideY)return yPos;
        else return yPos > winHeight - scmHeight ? (winHeight - scmHeight) : yPos;
    }

    return (
        <motion.div className="GeneralContextMenu" style={{top: getYCoord(props.yPos), left: getXCoord(props.xPos)}}
        initial={{scale: 0.7, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        exit={{scale: 0.7, opacity: 0}}>
            <PlayButton title={props.title} chooseOption={props.chooseOption}/>
            <PlayNextButton chooseOption={props.chooseOption}/>
            <PlayLaterButton chooseOption={props.chooseOption}/>
            {(props.CMtype === contextMenuEnum.ArtistCM) && <ShowArtistButton title={props.title} chooseOption={props.chooseOption}/>}
            {(props.CMtype === contextMenuEnum.ArtistCM || props.CMtype === contextMenuEnum.SongCM 
                || props.CMtype === contextMenuEnum.AlbumCM || props.CMtype === contextMenuEnum.PlaylistSongsCM
                || props.CMtype === contextMenuEnum.GenreCM  || props.CMtype === contextMenuEnum.PlaylistCM) 
                && <AddToPlaylistButton chooseOption={props.chooseOption}/>}
            {(props.CMtype === contextMenuEnum.GenreCM) && <ShowGenreButton  title={props.title} chooseOption={props.chooseOption}/>}
            {(props.CMtype === contextMenuEnum.PlaylistCM) && <ShowPlaylistButton  title={props.title} chooseOption={props.chooseOption}/>}
            {(props.CMtype === contextMenuEnum.AlbumCM) && <ShowAlbumButton title={props.title} chooseOption={props.chooseOption}/>}
            {props.CMtype === contextMenuEnum.SongCM && <EditSongButton title={props.title} chooseOption={props.chooseOption}/>}
            {(props.CMtype === contextMenuEnum.PlaylistCM || props.CMtype === contextMenuEnum.SongCM || props.CMtype === contextMenuEnum.PlaylistSongsCM) 
                && <ShowInfoButton chooseOption={props.chooseOption}/>}
            {(props.CMtype === contextMenuEnum.PlaylistCM || props.CMtype === contextMenuEnum.PlaylistSongsCM) 
            && <DeleteButton title={props.title} chooseOption={props.chooseOption}/>}
        </motion.div >
    )
}

export default GeneralContextMenu