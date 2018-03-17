import '../style.scss';
import { ready } from './browser/document';
import { Features } from './browser/features';
import {
    Config,
    DEFAULT_CONFIG
} from './config';
import { ZoomDOM } from './dom/zoom-dom';
import { ZoomListener } from './event/zoom-listener';
import { Zoom } from './zoom';

/**
 * Adds a {@link ZoomListener} for <code>click</code> events on the{@link Document#body}.
 */
export function listen(config: Config = DEFAULT_CONFIG): void {
    ready(() => {
        let body = document.body;
        let features = Features.of(body.style);

        let startZoom = (dom: ZoomDOM) => {
            let zoom = new Zoom(dom, features, config);
            zoom.expand();
        };

        body.addEventListener('click', new ZoomListener(startZoom));
    });
}

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
export * from './element/style';
export * from './element/transform';
export * from './element/transition';
export * from './event/add-class-listener';
export * from './event/collapse-end-listener';
export * from './event/collapse-start-listener';
export * from './event/esc-key-listener';
export * from './event/expand-end-listener';
export * from './event/resize-listener';
export * from './event/scroll-listener';
export * from './event/show-clone-listener';
export * from './event/util';
export * from './event/zoom-listener';
export * from './math/bounds';
export * from './math/unit';
export * from './math/vector2';
export * from './config';
export * from './zoom';
