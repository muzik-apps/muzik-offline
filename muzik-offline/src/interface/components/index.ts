import { lazy } from "react";
import HeaderWindows from "./navbar/HeaderWindows";
import HeaderMacOS from './navbar/HeaderMacOS';
import HeaderLinuxOS from "./navbar/HeaderLinuxOS";
import LeftSidebar from './navigation/LeftSidebar';
import AppMusicPlayer from './music/AppMusicPlayer';
import FSMusicPlayer from './music/FSMusicPlayer';
import SettingsNavigator from './buttons/SettingsNavigator';
import DropDownMenuLarge from './input/DropDownMenuLarge';
import RadioComponent from './input/RadioComponent';
const MainMusicPlayer = lazy(() => import('./music/MainMusicPlayer'));
const HistoryUpcoming = lazy(() => import('./music/HistoryUpcoming'));
import SquareTitleBox from './cards/SquareTitleBox';
import DropDownMenuSmall from './input/DropDownMenuSmall';
import RectangleSongBox from './cards/RectangleSongBox';
import SongCardResizable from './cards/SongCardResizable';
import AppNavigator from './buttons/AppNavigator';
import GeneralContextMenu from './context_menu/GeneralContextMenu';
import SearchNavigator from './buttons/SearchNavigator';
import DirectoriesModal from "./modals/DirectoriesModal";
import { ShowInfoButton } from './context_menu/ContextMenuButtons';
import NotifyBottomRight from './toasts/NotifyBottomRight';
import PropertiesModal from './modals/PropertiesModal';
import LargeResizableCover from './cards/LargeResizableCover';
import CreatePlaylistModal from './modals/CreatePlaylistModal';
import EditPlaylistModal from './modals/EditPlaylistModal';
import { PlayButton, PlayNextButton, PlayLaterButton, 
    ShowArtistButton, AddToPlaylistButton, ShowGenreButton, 
    ShowPlaylistButton, ShowAlbumButton } from './context_menu/ContextMenuButtons';
import AddSongToPlaylistModal from "./modals/AddSongToPlaylistModal";
import LoaderAnimated from './loader/LoaderAnimated';
import AirplayCastModal from './modals/AirplayCastModal';
import AddSongsToPlaylistModal from './modals/AddSongsToPlaylistModal';
import MusicPopOver from "./popover/MusicPopOver";
import SongCardResizableDraggable from './lists/SongCardResizableDraggable';
import RectangleSongBoxDraggable from './lists/RectangleSongBoxDraggable';

export {
    HeaderWindows, HeaderMacOS, HeaderLinuxOS, AppNavigator, LeftSidebar, AppMusicPlayer, FSMusicPlayer,
    SettingsNavigator, DropDownMenuLarge, RadioComponent, MainMusicPlayer,
    HistoryUpcoming, SquareTitleBox, DropDownMenuSmall, RectangleSongBox, 
    SongCardResizable, GeneralContextMenu,
    PlayButton, PlayNextButton, PlayLaterButton, ShowArtistButton,
    AddToPlaylistButton, ShowGenreButton, ShowPlaylistButton,
    ShowAlbumButton, SearchNavigator, DirectoriesModal, ShowInfoButton,
    NotifyBottomRight, PropertiesModal, LargeResizableCover,
    CreatePlaylistModal, EditPlaylistModal, AddSongToPlaylistModal, LoaderAnimated,
    AirplayCastModal, AddSongsToPlaylistModal, MusicPopOver, SongCardResizableDraggable,
    RectangleSongBoxDraggable
}