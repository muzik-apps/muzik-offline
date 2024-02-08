import { FunctionComponent, useEffect, useReducer } from "react";
import { motion } from 'framer-motion';
import "@styles/components/music/HistoryUpcoming.scss";
import { Song, contextMenuButtons, contextMenuEnum } from "@muziktypes/index";
import { AddSongToPlaylistModal, GeneralContextMenu, PropertiesModal, SongCardResizableDraggable } from "@components/index";
import { useNavigate } from "react-router-dom";
import { local_albums_db, local_songs_db } from "@database/database";
import { useUpcomingSongs, useHistorySongs, useSavedObjectStore, reducerType } from "@store/index";
import { UpcomingHistoryState, upcomingHistoryReducer } from "@store/reducerStore";
import { closeContextMenu, closePlaylistModal, closePropertiesModal } from "@utils/reducerUtils";
import { addThisSongToPlayNext, addThisSongToPlayLater, playThisSongFromQueue } from "@utils/playerControl";
import { onDragEnd } from "@utils/index";

type HistoryUpcomingprops = {
  closePlayer: () => void;
}

const HistoryUpcoming: FunctionComponent<HistoryUpcomingprops> = (props: HistoryUpcomingprops) => {
  const [state , dispatch] = useReducer(upcomingHistoryReducer, UpcomingHistoryState); 
  const {SongQueueKeys} = useUpcomingSongs((state) => { return { SongQueueKeys: state.queue}; });
  const {SongHistoryKeys} = useHistorySongs((state) => { return { SongHistoryKeys: state.queue}; });
  const {local_store} = useSavedObjectStore((state) => { return { local_store: state.local_store}; });
  
  const navigate = useNavigate();

  function setMenuOpenData__SongQueue(key: number, n_co_ords: {xPos: number; yPos: number;}){
    dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
    const matching_song = state.SongQueue.find((song, index) => { 
        if(song.id === key)dispatch({ type: reducerType.SET_KEY_INDEX_SONG_QUEUE, payload: {key,index,queueType: "SongQueue"} });
        return song.id === key; 
    });
    dispatch({ type: reducerType.SET_SONG_MENU, payload: matching_song ? matching_song : null });
  }

  function setMenuOpenData_SongHistory(key: number, n_co_ords: {xPos: number; yPos: number;}){
      dispatch({ type: reducerType.SET_COORDS, payload: n_co_ords });
      const matching_song = state.SongHistory.find((song, index) => { 
          if(song.id === key)dispatch({ type: reducerType.SET_KEY_INDEX_SONG_QUEUE, payload: {key,index,queueType: "SongHistory"} });
          return song.id === key; 
      });
      dispatch({ type: reducerType.SET_SONG_MENU, payload: matching_song ? matching_song : null });
  }

  function chooseOption(arg: contextMenuButtons){
    if(arg === contextMenuButtons.ShowInfo){ dispatch({ type: reducerType.SET_PROPERTIES_MODAL, payload: true}); }
    else if(arg === contextMenuButtons.AddToPlaylist){ dispatch({ type: reducerType.SET_PLAYLIST_MODAL, payload: true}); }
    else if(arg === contextMenuButtons.PlayNext && state.songMenuToOpen){ 
        addThisSongToPlayNext([state.songMenuToOpen.id]);
        closeContextMenu(dispatch); 
    }
    else if(arg === contextMenuButtons.PlayLater && state.songMenuToOpen){ 
        addThisSongToPlayLater([state.songMenuToOpen.id]);
        closeContextMenu(dispatch); 
    }
    else if(arg === contextMenuButtons.Play && state.songMenuToOpen){
        playThisSongFromQueue(state.kindex_sq.key, state.kindex_sq.index, state.kindex_sq.queueType);
        dispatch({ type: reducerType.SET_KEY_INDEX_SONG_QUEUE, payload: {key: -1, index: -1, queueType: "SongQueue"} });
        closeContextMenu(dispatch); 
    }
  }

  async function navigateTo(key: number, type: "artist" | "song", queueType: string){
    const relatedSong = queueType === "SongHistory" ? state.SongHistory.find((value) => value.id === key)
    : state.SongQueue.find((value) => value.id === key);
    if(!relatedSong)return;
    if(type === "song"){
        const albumres = await local_albums_db.albums.where("title").equals(relatedSong.album).first();
        if(albumres === undefined)return;
        navigate(`/AlbumDetails/${albumres.key}/undefined`);
        props.closePlayer();
    }
    else if(type === "artist"){
        navigate(`/ArtistCatalogue/${relatedSong.artist}`); 
        props.closePlayer();
    }
  }

  async function setLists(){
    const limit = Number.parseInt(local_store.UpcomingHistoryLimit);
    const sqkeys = SongQueueKeys.slice(0, limit);
    const hskeys = SongHistoryKeys.slice(SongHistoryKeys.length - limit, SongHistoryKeys.length);

    const USsongs = await local_songs_db.songs.where("id").anyOf(sqkeys).toArray();
    const HSsongs = await local_songs_db.songs.where("id").anyOf(hskeys).toArray();

    const USsongsOrdered = sqkeys.map(key => USsongs.find(item => item.id === key));
    const HSsongsOrdered = hskeys.map(key => HSsongs.find(item => item.id === key));

    dispatch({ type: reducerType.SET_SONG_QUEUE, payload: USsongsOrdered as Song[] });
    dispatch({ type: reducerType.SET_SONG_HISTORY, payload: HSsongsOrdered as Song[] });
  }

  useEffect(() => {setLists()}, [SongQueueKeys, SongHistoryKeys])

  return (
    <div className="HistoryUpcoming">
      {
        state.selectedView === "Upcoming_tab" ?
          <div className="Upcoming_view">
            <SongCardResizableDraggable 
                SongQueue={state.SongQueue} 
                queueType={"SongQueue"} 
                onDragEnd={onDragEnd} 
                setMenuOpenData={setMenuOpenData__SongQueue} 
                playThisSong={playThisSongFromQueue} 
                navigateTo={navigateTo} /> 
          </div>
        :
          <div className="History_view">
            <SongCardResizableDraggable 
                SongQueue={state.SongHistory} 
                queueType={"SongHistory"} 
                onDragEnd={onDragEnd} 
                setMenuOpenData={setMenuOpenData_SongHistory} 
                playThisSong={playThisSongFromQueue} 
                navigateTo={navigateTo} /> 
          </div>
      }
      <div className="HistoryUpcoming_tabs">
        <motion.div className="Upcoming_tab" whileTap={{scale: 0.98}}
          onClick={() => dispatch({ type: reducerType.SET_SELECTED_VIEW, payload: "Upcoming_tab" })}>
            {state.selectedView === "Upcoming_tab" && <div className="selected"/>}
            <h3>Upcoming songs</h3>
        </motion.div>
        <motion.div className="History_tab" whileTap={{scale: 0.98}}
          onClick={() => dispatch({ type: reducerType.SET_SELECTED_VIEW, payload: "History_tab" })}>
            {state.selectedView === "History_tab" && <div className="selected"/>}
            <h3>History</h3>
        </motion.div>
      </div>

      {
          state.songMenuToOpen && (
              <div className="HistoryUpcoming-ContextMenu-container" 
                onClick={(e) => closeContextMenu(dispatch, e)} onContextMenu={(e) => closeContextMenu(dispatch, e)}>
                  <GeneralContextMenu 
                      xPos={state.co_ords.xPos} 
                      yPos={state.co_ords.yPos} 
                      title={state.songMenuToOpen.name}
                      CMtype={contextMenuEnum.SongCM}
                      chooseOption={chooseOption}/>
              </div>
          )
      }

      <PropertiesModal isOpen={state.isPropertiesModalOpen} song={state.songMenuToOpen!} closeModal={() => closePropertiesModal(dispatch)} />
      <AddSongToPlaylistModal isOpen={state.isPlaylistModalOpen} songPath={state.songMenuToOpen ? state.songMenuToOpen.path : ""} closeModal={() => closePlaylistModal(dispatch)} />
    </div>
  )
}

export default HistoryUpcoming