export declare class AddClassListener implements EventListenerObject {
    private readonly element;
    private readonly eventType;
    private readonly token;
    constructor(element: Element, eventType: string, token: string);
    handleEvent(evt: Event): void;
}
