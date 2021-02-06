import { OverlayConfig } from '../config';
import { repaint } from './element';

export class Overlay {
    static create(config: OverlayConfig): Overlay {
        let element = document.createElement('div');
        element.className = config.classNames.base;
        return new Overlay(element, config);
    }

    private readonly element: HTMLDivElement;
    private readonly config: OverlayConfig;

    constructor(element: HTMLDivElement, config: OverlayConfig) {
        this.element = element;
        this.config = config;
    }

    appendTo<T extends Node>(parent: T): void {
        parent.appendChild(this.element);
        repaint(this.element);
        this.show();
    }

    removeFrom(node: Node): void {
        node.removeChild(this.element);
    }

    private show(): void {
        this.element.classList.add(this.config.classNames.visible);
    }

    hide() {
        this.element.classList.remove(this.config.classNames.visible);
    }
}
