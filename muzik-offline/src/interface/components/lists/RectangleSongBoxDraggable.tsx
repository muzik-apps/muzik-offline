import {RectangleSongBox} from "@components/index";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Song } from "@muziktypes/index";
import { ViewportList } from "react-viewport-list";

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
        <DragDropContext onDragEnd={(result) => props.onDragEnd(result)} >
            <Droppable droppableId="droppable">
                {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <ViewportList viewportRef={props.itemsHeightRef} items={props.SongList} ref={props.listRef}>
                                {
                                    (song, index) => (
                                        <Draggable key={song.id.toString()} draggableId={song.id.toString()} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                }
                            </ViewportList>
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    )
}

export default RectangleSongBoxDraggable