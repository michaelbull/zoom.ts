import { Vector2 } from '../math/vector2';
export declare class Wrapper {
    static readonly CLASS: string;
    static readonly EXPANDING_CLASS: string;
    static readonly EXPANDED_CLASS: string;
    static readonly COLLAPSING_CLASS: string;
    static create(): Wrapper;
    readonly element: HTMLElement;
    constructor(element: HTMLElement);
    startExpanding(): void;
    finishExpanding(): void;
    isExpanding(): boolean;
    startCollapsing(): void;
    finishCollapsing(): void;
    isCollapsing(): boolean;
    isTransitioning(): boolean;
    expanded(): void;
    collapse(): void;
    isExpanded(): boolean;
    position(): Vector2;
}
