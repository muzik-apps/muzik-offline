import {RectangleSongBox} from "@components/index";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Song } from "@muziktypes/index";
import { ViewportList } from "react-viewport-list";
import { Reorder } from "framer-motion";

type RectangleSongBoxDraggableProps = {
    selected: number;
    listRef: React.MutableRefObject<any>;
    itemsHeightRef: React.MutableRefObject<HTMLDivElement | null>;
    SongList: Song[];
    onDragEnd: (result: DropResult) => void;
    selectThisSong: (index: number) => void;
    setMenuOpenData: (key: number, co_ords: {xPos: number;yPos: number;}) => void;
    navigateTo: (key: number, type: "artist" | "song") => void;
    playThisSong: (key: number) => void;
}

const RectangleSongBoxDraggable = (props: RectangleSongBoxDraggableProps) => {
    return (
        <Reorder.Group 
            values={props.SongList} 
            onReorder={(reordered_songs) => console.log(reordered_songs)}
            axis="y"
            layoutScroll
            style={{ overflowY: "scroll" }}>
                <ViewportList viewportRef={props.itemsHeightRef} items={props.SongList} ref={props.listRef}>
                    {
                        (song, index) => (
                            <Reorder.Item value={song} key={song.id}>
                                <RectangleSongBox 
                                    key={song.id}
                                    keyV={song.id}
                                    index={index + 1} 
                                    cover={song.cover} 
                                    songName={song.name} 
                                    artist={song.artist}
                                    length={song.duration} 
                                    year={song.year}
                                    selected={props.selected === index + 1 ? true : false}
                                    selectThisSong={props.selectThisSong}
                                    setMenuOpenData={props.setMenuOpenData}
                                    navigateTo={props.navigateTo}
                                    playThisSong={props.playThisSong}/>
                            </Reorder.Item>
                        )
                    }
                </ViewportList>
        </Reorder.Group>
    )
}

export default RectangleSongBoxDraggable