/**
 * Represents a state that an {@link Overlay} can be in.
 */
export type State = 'hidden' | 'loading' | 'opening' | 'open' | 'closing';

/**
 * The base class name.
 */
const CLASS: string = 'zoom';

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
        this._element.className = CLASS + '__overlay';
    }

    /**
     * Adds the {@link _element} to the document's body.
     */
    add(): void {
        document.body.appendChild(this._element);
    }

    /**
     * Gets the modifier for the CSS class.
     * @returns {string} The modifier for the CSS class.
     */
    private modifier(): string {
        return `${CLASS}--${this._state}`;
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
            if (this._state !== 'hidden') {
                document.body.classList.remove(this.modifier());
            }

            this._state = state;

            if (this._state !== 'hidden') {
                document.body.classList.add(this.modifier());
            }
        });
    }
}
