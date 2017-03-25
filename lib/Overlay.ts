import {
    addClass,
    removeClass,
    repaint
} from './Element';

export function showOverlay(node: Node, overlay: HTMLDivElement): void {
    node.appendChild(overlay);
    repaint(overlay);
    addClass(overlay, 'zoom__overlay--visible');
}

export function hideOverlay(overlay: HTMLDivElement): void {
    removeClass(overlay, 'zoom__overlay--visible');
}
