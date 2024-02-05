import { FunctionComponent } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Song } from "@muziktypes/index";
import { SongCardResizable } from "@components/index";

type SongCardResizableDraggableProps = {
    SongQueue: Song[];
    queueType: "SongQueue" | "SongHistory";
    onDragEnd: (result: DropResult, queueType: "SongQueue" | "SongHistory") => void;
    setMenuOpenData: (key: number, co_ords: {xPos: number; yPos: number;}) => void;
    playThisSong: (key: number, index: number, queueType: "SongQueue" | "SongHistory") => void;
    navigateTo: (key: number, type: "artist" | "song", queueType: "SongQueue" | "SongHistory") => void;
}

const SongCardResizableDraggable: FunctionComponent<SongCardResizableDraggableProps> = (props: SongCardResizableDraggableProps) => {
    return (
        <DragDropContext onDragEnd={(result) => props.onDragEnd(result, props.queueType)} >
            <Droppable droppableId="droppable">
                {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {
                                props.SongQueue.map((song, index) => 
                                    <Draggable key={song.id.toString()} draggableId={song.id.toString()} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <SongCardResizable 
                                                    key={index}
                                                    cover={song.cover} 
                                                    songName={song.name}
                                                    artist={song.artist}
                                                    keyV={song.id}
                                                    setMenuOpenData={props.setMenuOpenData}
                                                    playThisSong={(key: number) => props.playThisSong(key, index, props.queueType)}
                                                    navigateTo={(key: number, type: "artist" | "song") => props.navigateTo(key, type, "SongQueue")}/>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            }
                            {provided.placeholder}
                        </div>
                    )
                }
            </Droppable>
        </DragDropContext>
    )
}

export default SongCardResizableDraggable