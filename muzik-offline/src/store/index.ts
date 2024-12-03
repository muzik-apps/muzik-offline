import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { firstRunState, FSState, MaximisedState, PlayerInterface, PlayingPositionInterface, portState, QueueInterface, SavedDirectoriesInterface, SavedObjectInterface, searchInterface, toastInterface, viewableSideElInterface, wallpaperInterface } from './storeTypes';
import { emptyDirectories } from '@database/directories';
import { emptyPlayer } from '@database/player';
import { emptySavedObject } from '@database/saved_object';
import { viewableSideElements } from '@database/side_elements';
import { alltracksReducer, AllTracksState } from './reducerStore';
import { reducerType, AllTracksStateInterface, Action } from './reducerTypes';

export type{
    AllTracksStateInterface, Action
}

export {
    reducerType,
    alltracksReducer, AllTracksState, 
}

export const useFisrstRunStore = create<firstRunState>()(
    devtools(
        persist(
            (set) => ({
                firstRun: true,
                setFirstRun: (nFR) => set((_state) => ({ firstRun: nFR })),
            }),
        {name: 'firstRun',}
        )
    )
)

export const usePortStore = create<portState>()(
    (set) => ({
        port: 0,
        setPort: (nPort) => set((_state) => ({ port: nPort })),
    }),
)

export const useIsMaximisedStore = create<MaximisedState>()(
    (set) => ({
        isMaximised: false,
        setMaximised: (nM: boolean) => set((_state) => ({ isMaximised: nM })),
    }),
)

export const useIsFSStore = create<FSState>()(
    (set) => ({
        isFS: false,
        setFS: (nFS: boolean) => set((_state) => ({ isFS: nFS })),
    }),
)

export const useToastStore = create<toastInterface>()(
    (set) => ({
        toastObject: null,
        setToast: (toast) => set((_state) => ({ toastObject: toast })),
        unsetToast: () => set((_state) => ({toastObject: null})),
    }),
)

export const useSearchStore = create<searchInterface>()(
    (set) => ({
        query: "",
        setSearch: (nq) => set((_state) => ({ query: nq })),
    }),
)

export const useWallpaperStore = create<wallpaperInterface>()(
    devtools(
        persist(
            (set) => ({
                wallpaperUUID: "",
                setWallpaper: (nW) => set((_state) => ({ wallpaperUUID: nW })),
                unsetWallpaper: () => set((_state) => ({ wallpaperUUID: null})),
            }),
        {name: 'SavedWallpaperUUID-offline',}
        )
    )
)

export const useViewableSideElStore = create<viewableSideElInterface>()(
    devtools(
        persist(
            (set) => ({
                viewableEl: viewableSideElements,
                setviewableEl: (setTo) => set((_state) => ({ viewableEl: setTo })),
            }),
        {name: 'viewableEl',}
        )
    )
)

export const useDirStore = create<SavedDirectoriesInterface>()(
    devtools(
        persist(
            (set) => ({
                dir: emptyDirectories,
                setDir: (setTo) => set((_state) => ({ dir: setTo })),
            }),
            {
                name: 'directories', // Key for localStorage
                storage: {
                    getItem: (name) => {
                        const data = localStorage.getItem(name);
                        if (data) {
                            const parsed = JSON.parse(data);
                            return {
                                ...parsed,
                                dir: {
                                    Dir: new Set(parsed.dir.Dir), // Convert Array back to Set
                                },
                            };
                        }
                        return null;
                    },
                    setItem: (name, value) => {
                        const serialized = JSON.stringify({
                            ...value,
                            dir: {
                                Dir: [...value.state.dir.Dir], // Convert Set to Array
                            },
                        });
                        localStorage.setItem(name, serialized);
                    },
                    removeItem: (name) => {
                        localStorage.removeItem(name);
                    }
                }
            }
        )
    )
)

export const useSavedObjectStore = create<SavedObjectInterface>()(
    devtools(
        persist(
            (set) => ({
                local_store: emptySavedObject,
                setStore: (setTo) => set((_state) => ({ local_store: setTo })),
            }),
        {name: 'SavedObject-offline',}
        )
    )
)

export const usePlayerStore = create<PlayerInterface>()(
    (set) => ({
        Player: emptyPlayer,
        setPlayer: (setTo) => set((_state) => ({ Player: setTo })),
    }),
)

export const usePlayingPosition = create<PlayingPositionInterface>()(
    (set) => ({
        position: 0,
        setPosition: (setTo) => set((_state) => ({ position: setTo })),
    }),
)

export const usePlayingPositionSec = create<PlayingPositionInterface>()(
    (set) => ({
        position: 0,
        setPosition: (setTo) => set((_state) => ({ position: setTo })),
    }),
)

export const useUpcomingSongs = create<QueueInterface>()(
    (set) => ({
        queue: [],
        enqueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
        dequeue: () => set((state) => ({ queue: state.queue.slice(1) })),
        clearQueue: () => set((_state) => ({ queue: [] })),
        push_front: (song) => set((state) => ({ queue: [song, ...state.queue] })),
        pop_back: () => set((state) => ({ queue: state.queue.slice(0, state.queue.length - 1) })),
        setQueue: (setTo) => set((_state) => ({ queue: setTo })),
    }),
)

export const useHistorySongs = create<QueueInterface>()(
    (set) => ({
        queue: [],
        enqueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
        dequeue: () => set((state) => ({ queue: state.queue.slice(1) })),
        clearQueue: () => set((_state) => ({ queue: [] })),
        push_front: (song) => set((state) => ({ queue: [song, ...state.queue] })),
        pop_back: () => set((state) => ({ queue: state.queue.slice(0, state.queue.length - 1) })),
        setQueue: (setTo) => set((_state) => ({ queue: setTo })),
    }),
)