import { FunctionComponent } from 'react';
import { contextMenuButtons } from 'types';
import { ArrowCurveLeftRight, ArrowCurveRightUp, Disk, Edit, InformationCircleContained, LayersThree, Menu, Microphone, Play, Trash } from '@assets/icons';
import { motion } from 'framer-motion';

type ContextMenuButtonsProps = {
    title?: string;
    chooseOption: (option: contextMenuButtons) => void;
}

export const PlayButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="Play" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.Play)}>
            <Play />
            <p>Play "{props.title}"</p>
        </motion.div>
    )
}

export const PlayNextButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="PlayNext" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.PlayNext)}>
            <ArrowCurveRightUp />
            <p>Play Next</p>
        </motion.div>
    )
}

export const PlayLaterButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="PlayLater" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.PlayLater)}>
            <ArrowCurveLeftRight />
            <p>Play Later</p>
        </motion.div>
    )
}

export const ShowArtistButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="ShowArtist" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.ShowArtist)}>
            <Microphone />
            <p>Show "{props.title}"</p>
        </motion.div>
    )
}


export const AddToPlaylistButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="Add_to_playlist" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.AddToPlaylist)}>
            <Menu />
            <p>Add to playlist</p>
        </motion.div>
    )
}

export const ShowGenreButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="Genre" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.ShowGenre)}>
            <Disk />
            <p>Show "{props.title}"</p>
        </motion.div>
    )
}

export const ShowPlaylistButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="ShowPlaylist" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.ShowPlaylist)}>
            <Menu />
            <p>Show "{props.title}"</p>
        </motion.div>
    )
}

export const ShowAlbumButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="ShowAlbum" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.ShowAlbum)}>
            <LayersThree />
            <p>Show "{props.title}"</p>
        </motion.div>
    )
}

export const ShowInfoButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="ShowInfo" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.ShowInfo)}>
            <InformationCircleContained />
            <p>Properties</p>
        </motion.div>
    )
}

export const DeleteButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="DeleteButton" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.Delete)}>
            <Trash />
            <p>Delete "{props.title}"</p>
        </motion.div>
    )
}

export const EditSongButton: FunctionComponent<ContextMenuButtonsProps> = (props: ContextMenuButtonsProps) => {
    return (
        <motion.div className="EditSong" whileTap={{scale: 0.98}} onMouseDown={() => props.chooseOption(contextMenuButtons.EditSong)}>
            <Edit />
            <p>Edit "{props.title}"</p>
        </motion.div>
    )
}