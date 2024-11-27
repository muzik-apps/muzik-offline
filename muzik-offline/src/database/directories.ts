export interface SavedDirectories{
    Dir: Set<string>;
}

export const emptyDirectories: SavedDirectories = {
    Dir: new Set<string>()
}