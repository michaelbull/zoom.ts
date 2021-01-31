import { Zoom } from '../Zoom';

export class CollapseStartListener implements EventListenerObject {
    private readonly zoom: Zoom;

    constructor(zoom: Zoom) {
        this.zoom = zoom;
    }

    handleEvent(evt: Event): void {
        evt.preventDefault();
        evt.stopPropagation();
        this.zoom.collapse();
    }
}
