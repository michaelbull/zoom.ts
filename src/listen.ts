import {
    Features,
    ready
} from './browser';
import {
    Config,
    DEFAULT_CONFIG
} from './config';
import { ZoomListener } from './event';
import { Zoom } from './zoom';

/**
 * Adds a {@link ZoomListener} for <code>click</code> events on the{@link Document#body}.
 */
export function listen(config: Config = DEFAULT_CONFIG): void {
    ready(() => {
        let body = document.body;
        let features = Features.of(body.style);

        body.addEventListener('click', new ZoomListener(dom => {
            let zoom = new Zoom(dom, features, config);
            zoom.expand();
        }));
    });
}
