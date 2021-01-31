import { repaint } from './element';

export class Overlay {
    static readonly CLASS = 'zoom__overlay';
    static readonly VISIBLE_CLASS = 'zoom__overlay--visible';

    static create(): Overlay {
        let element = document.createElement('div');
        element.className = Overlay.CLASS;
        return new Overlay(element);
    }

    readonly element: HTMLDivElement;

    constructor(element: HTMLDivElement) {
        this.element = element;
    }

    appendTo(node: Node): void {
        node.appendChild(this.element);
        repaint(this.element);
        this.show();
    }

    removeFrom(node: Node): void {
        node.removeChild(this.element);
    }

    private show(): void {
        this.element.classList.add(Overlay.VISIBLE_CLASS);
    }

    hide() {
        this.element.classList.remove(Overlay.VISIBLE_CLASS);
    }
}
