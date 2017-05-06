export interface Config {
    readonly scrollDismissPx: number;
    readonly cloneClass: string;
    readonly cloneVisibleClass: string;
    readonly cloneLoadedClass: string;
}

export const DEFAULT_CONFIG: Config = {
    scrollDismissPx: 50,
    cloneClass: 'zoom__clone',
    cloneVisibleClass: 'zoom__clone--visible',
    cloneLoadedClass: 'zoom__clone--loaded'
};
