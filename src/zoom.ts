import { ready } from './browser/document';
import { Features } from './browser/features';
import {
    Config,
    DEFAULT_CONFIG
} from './config';
import { ZoomListener } from './event/zoom-listener';

/**
 * Adds a {@link ZoomListener} for click events on the {@link Document#body}.
 */
export function listen(config: Config = DEFAULT_CONFIG): void {
    ready(document, () => {
        let body = document.body;
        let features = Features.of(body.style);
        let listener = new ZoomListener(body, features, config);
        body.addEventListener('click', listener);
    });
}

export * from './config';
export * from './browser/document';
export * from './browser/features';
export * from './browser/vendor';
export * from './browser/window';
export * from './dom/clone';
export * from './dom/container';
export * from './dom/image';
export * from './dom/overlay';
export * from './dom/wrapper';
export * from './dom/zoom-dom';
export * from './element/element';
export * from './element/scale-and-translate';
export * from './element/transform';
export * from './element/transition';
export * from './event/dismiss-listener';
export * from './event/esc-key-listener';
export * from './event/event-listener';
export * from './event/resized-listener';
export * from './event/scroll-listener';
export * from './event/zoom-listener';
export * from './math/bounds';
export * from './math/unit';
export * from './math/vector2';
