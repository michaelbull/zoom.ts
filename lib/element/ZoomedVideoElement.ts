import { Overlay } from '../Overlay';
import { Zoomable } from '../Zoomable';
import { ALWAYS_PLAY_VIDEO_VALUE, PLAY_VIDEO_KEY } from '../util/Attributes';
import { ZoomedElement } from './ZoomedElement';

/**
 * Represents a {@link ZoomedElement} whose underlying element is a HTMLVideoElement.
 */
export class ZoomedVideoElement extends ZoomedElement {

    /**
     * The underlying video element.
     */
    private _video: HTMLVideoElement;

    /**
     * Creates a new {@link ZoomedVideoElement}.
     * @param element The underlying video element.
     * @param overlay The {@link Overlay}.
     */
    constructor(element: Zoomable, overlay: Overlay) {
        super(element, overlay);
        this._video = element as HTMLVideoElement;
    }

    zoomedIn(loaded: Function): void {
        let video: HTMLVideoElement = document.createElement('video');
        let source: HTMLSourceElement = document.createElement('source');

        video.appendChild(source);
        video.addEventListener('canplay', () => {
            this.loaded(video.videoWidth, video.videoHeight);
            this._video.play();
            loaded();
        });

        source.src = this._fullSrc;
    }

    zoomedOut(): void {
        if (this._video.getAttribute(PLAY_VIDEO_KEY) === ALWAYS_PLAY_VIDEO_VALUE) {
            this._video.play();
        }
    }

    width(): number {
        return this._video.width || this._video.videoWidth;
    }
}
