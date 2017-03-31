export const ESCAPE_KEY_CODE: number = 27;

export function escKeyPressed(callback: Function): EventListener {
    return (event: KeyboardEvent): void => {
        if (event.keyCode === ESCAPE_KEY_CODE) {
            event.preventDefault();
            callback();
        }
    };
}

export function scrolled(start: number, minAmount: number, callback: Function, current: () => number): EventListener {
    return (): void => {
        if (Math.abs(start - current()) >= minAmount) {
            callback();
        }
    };
}
