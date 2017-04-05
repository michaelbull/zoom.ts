export interface Config {
    scrollDelta: number;
}

export function defaultConfig(): Config {
    return {
        scrollDelta: 50
    };
}
