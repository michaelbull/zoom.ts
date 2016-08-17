import {
    ALWAYS_PLAY_VIDEO_VALUE,
    PLAY_VIDEO_KEY
} from './Attributes';
import { ZoomedElement } from './ZoomedElement';

export class ZoomedVideoElement extends ZoomedElement {
    zoomedIn(): void {
        const video: HTMLVideoElement = document.createElement('video');
        const source: HTMLSourceElement = document.createElement('source');

        video.appendChild(source);
        video.addEventListener('canplay', () => {
            this.zoomOriginal(video.videoWidth, video.videoHeight);
            (this._element as HTMLVideoElement).play();
        });

        source.src = this._fullSrc;
    }

    disposed(): void {
        const video: HTMLVideoElement = this._element as HTMLVideoElement;

        if (this._element.getAttribute(PLAY_VIDEO_KEY) === ALWAYS_PLAY_VIDEO_VALUE) {
            video.play();
        }
    }

    width(): number {
        return this._element.width || (this._element as HTMLVideoElement).videoWidth;
    }
}
