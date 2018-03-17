import { Features } from '../browser/features';
import { Bounds } from '../math/bounds';
import { Vector2 } from '../math/vector2';
export declare class Container {
    static readonly CLASS: string;
    static create(): Container;
    readonly element: HTMLElement;
    constructor(element: HTMLElement);
    clone(): HTMLImageElement;
    setBounds(bounds: Bounds): void;
    resetBounds(): void;
    resetStyle(property: string): void;
    fillViewport(features: Features, target: Vector2, bounds: Bounds): void;
}
