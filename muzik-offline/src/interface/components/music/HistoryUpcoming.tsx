import { useState } from "react";
import { motion } from 'framer-motion';
import "@styles/components/music/HistoryUpcoming.scss";
import { Song, contextMenuButtons, contextMenuEnum, mouse_coOrds } from "types";
import { GeneralContextMenu, SongCardResizable } from "@components/index";
import useLocalStorageState from "use-local-storage-state";

const HistoryUpcoming = () => {
  const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
  const [selectedView, setSelectedView] = useState<string>("Upcoming_tab");
  const [SongQueue,] = useLocalStorageState<Song[]>("SongQueue", {defaultValue: []});
  const [SongHistory,] = useLocalStorageState<Song[]>("SongHistory", {defaultValue: []});
  const [songMenuToOpen, setSongMenuToOpen] = useState< Song | null>(null);

  function selectView(arg: string){setSelectedView(arg);}

  function setMenuOpenData__SongQueue(key: number, n_co_ords: {xPos: number; yPos: number;}){
    setCoords(n_co_ords);
    const matching_song = SongQueue.find(song => { return song.id === key; })
    setSongMenuToOpen(matching_song ? matching_song : null);
}

function setMenuOpenData_SongHistory(key: number, n_co_ords: {xPos: number; yPos: number;}){
    setCoords(n_co_ords);
    const matching_song = SongHistory.find(song => { return song.id === key; })
    setSongMenuToOpen(matching_song ? matching_song : null);
}

  function chooseOption(arg: contextMenuButtons){

  }

  return (
    <div className="HistoryUpcoming">
      {
        selectedView === "Upcoming_tab" ?
          <div className="Upcoming_view">
            {
                SongQueue.slice(0, 20).map((song) => 
                    <SongCardResizable 
                        key={song.id}
                        cover={song.cover} 
                        songName={song.title}
                        artist={song.artist}
                        keyV={song.id}
                        setMenuOpenData={setMenuOpenData__SongQueue}
                        />
                )
            }
          </div>
        :
          <div className="History_view">
            {
                SongHistory.slice(SongHistory.length - 21, SongHistory.length - 1).map((song) => 
                    <SongCardResizable 
                        key={song.id}
                        cover={song.cover} 
                        songName={song.title}
                        artist={song.artist}
                        keyV={song.id}
                        setMenuOpenData={setMenuOpenData_SongHistory}
                        />
                )
            }
          </div>
      }
      <div className="HistoryUpcoming_tabs">
        <motion.div className="Upcoming_tab" onClick={() => selectView("Upcoming_tab")} whileTap={{scale: 0.98}}>
          {selectedView === "Upcoming_tab" && <div className="selected"/>}
          <h3>Upcoming songs</h3>
        </motion.div>
        <motion.div className="History_tab" onClick={() => selectView("History_tab")} whileTap={{scale: 0.98}}>
          {selectedView === "History_tab" && <div className="selected"/>}
          <h3>History</h3>
        </motion.div>
      </div>

      {
          songMenuToOpen && (
              <div className="HistoryUpcoming-ContextMenu-container" 
              onMouseUp={() => {
                  setSongMenuToOpen(null);
                  setCoords({xPos: 0, yPos: 0});
              }} 
              onContextMenu={(e) => {
                  e.preventDefault();
                  setSongMenuToOpen(null);
                  setCoords({xPos: 0, yPos: 0});
              }}
              >
                  <GeneralContextMenu 
                      xPos={co_ords.xPos} 
                      yPos={co_ords.yPos} 
                      title={songMenuToOpen.title}
                      CMtype={contextMenuEnum.SongCM}
                      chooseOption={chooseOption}/>
              </div>
          )
      }
    </div>
  )
}

export default HistoryUpcoming