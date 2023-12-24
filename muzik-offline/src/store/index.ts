import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PlayerInterface, QueueInterface, SavedDirectoriesInterface, SavedObjectInterface, searchInterface, toastInterface, viewableSideElInterface, wallpaperInterface } from './storeTypes';
import { emptyDirectories } from '@database/directories';
import { emptyPlayer } from '@database/player';
import { emptySavedObject } from '@database/saved_object';
import { viewableSideElements } from '@database/side_elements';
import { emptyWallpaper } from '@database/wallpaper';

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
                wallpaper: emptyWallpaper,
                setWallpaper: (nW) => set((_state) => ({ wallpaper: nW })),
                unsetWallpaper: () => set((_state) => ({ wallpaper: null})),
            }),
        {name: 'SavedWallpaper-offline',}
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
        {name: 'directories',}
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
    devtools(
        persist(
            (set) => ({
                Player: emptyPlayer,
                setPlayer: (setTo) => set((_state) => ({ Player: setTo })),
            }),
        {name: 'Player-offline',}
        )
    )
)

export const useUpcomingSongs = create<QueueInterface>()(
    devtools(
        persist(
            (set) => ({
                queue: [],
                enqueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
                dequeue: () => set((state) => ({ queue: state.queue.slice(1) })),
            }),
        {name: 'upcomingSongs-offline',}
        )
    )
)

export const useHistorySongs = create<QueueInterface>()(
    devtools(
        persist(
            (set) => ({
                queue: [],
                enqueue: (song) => set((state) => ({ queue: [...state.queue, song] })),
                dequeue: () => set((state) => ({ queue: state.queue.slice(1) })),
            }),
        {name: 'historySongs-offline',}
        )
    )
)