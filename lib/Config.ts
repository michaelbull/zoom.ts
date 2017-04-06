export interface Config {
    readonly scrollDelta: number;
}

export function defaultConfig(): Config {
    return {
        scrollDelta: 50
    };
}
