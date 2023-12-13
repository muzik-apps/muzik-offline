import { useState } from "react";
import { motion } from 'framer-motion';
import "@styles/components/music/HistoryUpcoming.scss";
import { contextMenuEnum, mouse_coOrds, songDetails } from "types";
import { song8 } from "@assets/index";
import { GeneralContextMenu, SongCardResizable } from "@components/index";

const song_queue: songDetails[] = [
  {
      key: 1,
      cover: song8,
      songName: "Sample Song 1",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 2,
      cover: song8,
      songName: "Sample Song 2",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 3,
      cover: song8,
      songName: "Sample Song 3",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 4,
      cover: song8,
      songName: "Sample Song 4",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 5,
      cover: song8,
      songName: "Sample Song 5",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 6,
      cover: song8,
      songName: "Sample Song 6",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 7,
      cover: song8,
      songName: "Sample Song 8",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 8,
      cover: song8,
      songName: "Sample Song 9",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 9,
      cover: song8,
      songName: "Sample Song 10",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 10,
      cover: song8,
      songName: "Sample Song 11",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 11,
      cover: song8,
      songName: "Sample Song 11",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 12,
      cover: song8,
      songName: "Sample Song 12",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  },
  {
      key: 13,
      cover: song8,
      songName: "Sample Song 13",
      artist: "Sample artist 5",
      explicitStatus: true,
      hearted: true
  }
]

const HistoryUpcoming = () => {
  const [co_ords, setCoords] = useState<mouse_coOrds>({xPos: 0, yPos: 0});
  const [songMenuToOpen, setSongMenuToOpen] = useState<songDetails | null>(null);
  const [selectedView, setSelectedView] = useState<string>("Lyrics_tab");

  function selectView(arg: string){setSelectedView(arg);}

  function setMenuOpenData(key: number, n_co_ords: {xPos: number; yPos: number;}){
    setCoords(n_co_ords);
    const matching_song = song_queue.find(song => { return song.key === key; })
    setSongMenuToOpen(matching_song ? matching_song : null);
}

  return (
    <div className="HistoryUpcoming">
      {
        selectedView === "Upcoming_tab" ?
          <div className="Upcoming_view">
            
          </div>
        :
          <div className="History_view">
            
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
                      title={songMenuToOpen.songName}
                      CMtype={contextMenuEnum.SongCM}/>
              </div>
          )
      }
    </div>
  )
}

export default HistoryUpcoming