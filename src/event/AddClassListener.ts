export class AddClassListener implements EventListenerObject {
    private readonly element: Element;
    private readonly eventType: string;
    private readonly token: string;

    constructor(element: Element, eventType: string, token: string) {
        this.element = element;
        this.eventType = eventType;
        this.token = token;
    }

    handleEvent(evt: Event): void {
        this.element.removeEventListener(this.eventType, this);
        this.element.classList.add(this.token);
    }
}
