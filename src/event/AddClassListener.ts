export class AddClassListener implements EventListenerObject {
    private readonly element: Element;
    private readonly eventType: string;
    private readonly className: string;

    constructor(element: Element, eventType: string, className: string) {
        this.element = element;
        this.eventType = eventType;
        this.className = className;
    }

    handleEvent(evt: Event): void {
        this.element.removeEventListener(this.eventType, this);
        this.element.classList.add(this.className);
    }
}
