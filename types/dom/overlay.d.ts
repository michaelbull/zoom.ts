export declare class Overlay {
    static readonly CLASS: string;
    static readonly VISIBLE_CLASS: string;
    static create(): Overlay;
    readonly element: HTMLDivElement;
    constructor(element: HTMLDivElement);
    appendTo(node: Node): void;
    removeFrom(node: Node): void;
    private show();
    hide(): void;
}
