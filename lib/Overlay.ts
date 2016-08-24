/**
 * Represents a state that an {@link Overlay} can be in.
 */
export type State = 'hidden' | 'loading' | 'opening' | 'open' | 'closing';

/**
 * The class name of the {@link Overlay}'s {@link _element}.
 */
const CLASS: string = 'zoom-overlay';

/**
 * Represents an overlay that is appended to the document and creates a backdrop behind the zoomed element.
 */
export class Overlay {

    /**
     * The underlying element.
     */
    private _element: HTMLDivElement = document.createElement('div');

    /**
     * The current state.
     */
    private _state: State = 'hidden';

    /**
     * Creates a new {@link Overlay}.
     */
    constructor() {
        this._element.className = CLASS;
    }

    /**
     * Adds the {@link _element} to the document's body.
     */
    add(): void {
        document.body.classList.add(CLASS + '-' + this._state);
        document.body.appendChild(this._element);
    }

    /**
     * Gets the current state.
     * @returns The current state.
     */
    get state(): State {
        return this._state;
    }

    /**
     * Sets the current state.
     * @param state The state to set.
     */
    set state(state: State) {
        window.requestAnimationFrame(() => {
            document.body.classList.remove(CLASS + '-' + this._state);
            this._state = state;
            document.body.classList.add(CLASS + '-' + this._state);
        });
    }
}
