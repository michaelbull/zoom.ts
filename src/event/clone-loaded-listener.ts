import { Clone } from '../dom/clone';

export class CloneLoadedListener implements EventListenerObject {
    element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    handleEvent(evt: Event): void {
        this.element.classList.add(Clone.LOADED_CLASS);
    }
}
