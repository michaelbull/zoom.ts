import {
    ALWAYS_PLAY_VIDEO_VALUE,
    PLAY_VIDEO_KEY
} from './Attributes';
import { Zoomable } from './Zoomable';
import { ZoomedElement } from './ZoomedElement';

export class ZoomedVideoElement extends ZoomedElement {
    private _video: HTMLVideoElement;

    constructor(element: Zoomable) {
        super(element);
        this._video = element as HTMLVideoElement;
    }

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

    disposed(): void {
        if (this._video.getAttribute(PLAY_VIDEO_KEY) === ALWAYS_PLAY_VIDEO_VALUE) {
            this._video.play();
        }
    }

    width(): number {
        return this._video.width || this._video.videoWidth;
    }
}
