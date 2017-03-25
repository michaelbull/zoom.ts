export const ESCAPE_KEY_CODE: number = 27;

export function escapeKeyListener(callback: Function): EventListener {
    return (event: KeyboardEvent): void => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            return callback();
        }
    };
}

export function scrollListener(start: number, delta: number, current: () => number, callback: Function): EventListener {
    return (): void => {
        if (Math.abs(start - current()) >= delta) {
            return callback();
        }
    };
}
