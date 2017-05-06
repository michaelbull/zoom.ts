import { Config } from '../Config';
import { addClass } from './ClassList';
import { repaint } from './Element';

export function addOverlay(config: Config, overlay: HTMLDivElement): void {
    document.body.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, config.overlayVisibleClass);
}
