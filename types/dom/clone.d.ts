export declare class Clone {
    static readonly CLASS: string;
    static readonly VISIBLE_CLASS: string;
    static readonly LOADED_CLASS: string;
    static create(src: string): Clone;
    readonly element: HTMLImageElement;
    constructor(element: HTMLImageElement);
    show(): void;
    hide(): void;
    isVisible(): boolean;
    isHidden(): boolean;
    loaded(): void;
    isLoaded(): boolean;
    isLoading(): boolean;
}
