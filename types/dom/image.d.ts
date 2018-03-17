import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
export declare class Image {
    static readonly CLASS: string;
    static readonly HIDDEN_CLASS: string;
    static readonly ACTIVE_CLASS: string;
    readonly element: HTMLImageElement;
    constructor(element: HTMLImageElement);
    bounds(): Bounds;
    hide(): void;
    show(): void;
    isHidden(): boolean;
    activate(): void;
    deactivate(): void;
    targetSize(): Vector2;
    clearFixedSizes(): void;
}
