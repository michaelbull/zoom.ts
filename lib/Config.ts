export interface Config {
    readonly scrollDismissPx: number;
}

export function defaultConfig(): Config {
    return {
        scrollDismissPx: 50
    };
}
