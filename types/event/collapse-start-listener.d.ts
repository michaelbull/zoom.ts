import { Zoom } from '../zoom';
export declare class CollapseStartListener implements EventListenerObject {
    private readonly zoom;
    constructor(zoom: Zoom);
    handleEvent(evt: Event): void;
}
