import { Zoomable } from '../Zoomable';
import {
    ALWAYS_PLAY_VIDEO_VALUE,
    PLAY_VIDEO_KEY
} from '../util/Attributes';
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
     */
    constructor(element: Zoomable) {
        super(element);
        this._video = element as HTMLVideoElement;
    }

    /**
     * @inheritDoc
     */
    zoomedIn(): void {
        const video: HTMLVideoElement = document.createElement('video');
        const source: HTMLSourceElement = document.createElement('source');

        video.appendChild(source);
        video.addEventListener('canplay', () => {
            this.loaded(video.videoWidth, video.videoHeight);
            this._video.play();
        });

        source.src = this._fullSrc;
    }

    /**
     * @inheritDoc
     */
    zoomedOut(): void {
        if (this._video.getAttribute(PLAY_VIDEO_KEY) === ALWAYS_PLAY_VIDEO_VALUE) {
            this._video.play();
        }
    }

    /**
     * @inheritDoc
     */
    width(): number {
        return this._video.width || this._video.videoWidth;
    }
}
