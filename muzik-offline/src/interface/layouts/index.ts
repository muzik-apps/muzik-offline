import {lazy} from 'react';

const GeneralSettings = lazy(() => import('./GeneralSettings'));
const AppearanceSettings = lazy(() => import('./AppearanceSettings'));
import HistoryNextFloating from './HistoryNextFloating';
import SearchSongs from './SearchSongs';
import SearchArtists from './SearchArtists';
import SearchAlbums from './SearchAlbums';
import SearchGenres from './SearchGenres';
import SearchPlaylists from './SearchPlaylists';
const AdvancedSettings = lazy(() => import('@layouts/AdvancedSettings'));
const SecuritySettings = lazy(() => import('./SecuritySettings'));
const AboutSettings = lazy(() => import('./AboutSettings'));

export {
    GeneralSettings, AppearanceSettings, HistoryNextFloating,
    SearchSongs, SearchArtists, SearchAlbums, SearchGenres,
    SearchPlaylists, AdvancedSettings, SecuritySettings, AboutSettings
}