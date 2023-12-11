import { contextMenuButtons, contextMenuEnum } from "types";
import { FunctionComponent } from "react";
import { AddToPlaylistButton, FavoriteButton, HeartButton, PlayButton,
    PlayLaterButton, PlayNextButton, ShowArtistButton, ShowChartButton,
    ShowGenreButton, ShowPlaylistButton, UnFavoriteButton, UnHeartButton,
    ShowAlbumButton } from "@components/index";
import "@styles/components/context_menu/GeneralContextMenu.scss";

type GeneralContextMenuProps = {
    xPos: number;
    overRideX?: boolean;
    overRideY?: boolean;
    yPos: number;
    title: string;
    CMtype: contextMenuEnum;
    favourited?: boolean;
    hearted?: boolean;
}

const GeneralContextMenu: FunctionComponent<GeneralContextMenuProps> = (props: GeneralContextMenuProps) => {
    function logger(option: contextMenuButtons){
        console.log("test");
    }

    function getXCoord(xPos: number){
        const winWidth: number = window.innerWidth - 20;
        const scmWidth: number = 155;
        if(props.overRideX)return xPos;
        else return xPos > winWidth - scmWidth ? (winWidth - scmWidth - scmWidth + 20) : xPos;
    }

    function getYCoord(yPos: number){
        const winHeight: number = window.innerHeight - 35;
        let scmHeight: number = 0;
        if(props.CMtype === contextMenuEnum.SongCM){//5 items
            scmHeight = 250;
        }
        else if(props.CMtype === contextMenuEnum.ArtistCM || props.CMtype === contextMenuEnum.AlbumCM){//6 items
            scmHeight = 280;
        }
        else if(props.CMtype === contextMenuEnum.ChartsCM || props.CMtype === contextMenuEnum.PlaylistCM || props.CMtype === contextMenuEnum.GenreCM){//4 items
            scmHeight = 210;
        }
        if(props.overRideY)return yPos;
        else return yPos > winHeight - scmHeight ? (winHeight - scmHeight) : yPos;
    }

    return (
        <div className="GeneralContextMenu" style={{top: getYCoord(props.yPos), left: getXCoord(props.xPos)}}>
            <PlayButton title={props.title} chooseOption={logger}/>
            <PlayNextButton chooseOption={logger}/>
            <PlayLaterButton chooseOption={logger}/>
            {   
                (props.CMtype === contextMenuEnum.SongCM || props.CMtype === contextMenuEnum.AlbumCM) &&
                (props.hearted ? <UnHeartButton chooseOption={logger}/> : <HeartButton chooseOption={logger}/>)
            }
            {(props.CMtype === contextMenuEnum.ArtistCM) && <ShowArtistButton title={props.title} chooseOption={logger}/>}
            {   
                (props.CMtype === contextMenuEnum.ArtistCM) &&
                (props.favourited ? <UnFavoriteButton chooseOption={logger}/> : <FavoriteButton chooseOption={logger}/> )
            }
            {((props.CMtype === contextMenuEnum.ArtistCM) || (props.CMtype === contextMenuEnum.SongCM) || (props.CMtype === contextMenuEnum.AlbumCM)) 
                    && <AddToPlaylistButton chooseOption={logger}/>}
            {(props.CMtype === contextMenuEnum.ChartsCM) && <ShowChartButton  title={props.title} chooseOption={logger}/>}
            {(props.CMtype === contextMenuEnum.GenreCM) && <ShowGenreButton  title={props.title} chooseOption={logger}/>}
            {(props.CMtype === contextMenuEnum.PlaylistCM) && <ShowPlaylistButton  title={props.title} chooseOption={logger}/>}
            {(props.CMtype === contextMenuEnum.AlbumCM) && <ShowAlbumButton  title={props.title} chooseOption={logger}/>}
        </div >
    )
}

export default GeneralContextMenu