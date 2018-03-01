import { createDiv } from '../browser/Document';
import { repaint } from '../element/Element';

export class Overlay {
    static readonly CLASS = 'zoom__overlay';
    static readonly VISIBLE_CLASS = 'zoom__overlay--visible';

    static create(): Overlay {
        let element = createDiv(Overlay.CLASS);
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

    show(): void {
        this.element.classList.add(Overlay.VISIBLE_CLASS);
    }

    hide() {
        this.element.classList.remove(Overlay.VISIBLE_CLASS);
    }

    add(): void {
        document.body.appendChild(this.element);
    }

    remove(): void {
        document.body.removeChild(this.element);
    }
}
