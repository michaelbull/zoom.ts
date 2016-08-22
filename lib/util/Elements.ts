import { Zoomable } from '../Zoomable';
import { Dimensions } from './Dimensions';

/**
 * The event types to listen for that trigger at the end of an element's transition.
 */
const transitionEndEvents: string[] = [
    'transitionend',
    'webkitTransitionEnd',
    'oTransitionEnd'
];

/**
 * Contains utility methods for HTMLElements.
 */
export class ElementUtils {

    /**
     * Forces an element to repaint on the canvas.
     */
    public static repaint(element: HTMLElement): void {
        /* tslint:disable */
        element.offsetWidth;
        /* tslint:enable */
    }

    /**
     * Sets an element's transform style property.
     * @param element The element.
     * @param style The style to apply to the transform property.
     */
    public static transform(element: HTMLElement, style: string): void {
        element.style.webkitTransform = style;
        element.style.transform = style;
    }

    /**
     * Removes an element's transform style property.
     * @param element The element.
     */
    public static removeTransform(element: HTMLElement): void {
        element.style.removeProperty('webkitTransform');
        element.style.removeProperty('transform');
    }

    /**
     * Adds an event listener that is called on the end of a transition.
     * @param element The element whose events should be listened to.
     * @param listener The listener to call once an event is received.
     */
    public static addTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        if ('transition' in document.body.style) {
            for (let event of transitionEndEvents) {
                console.log('add event listener to event: ' + event);
                element.addEventListener(event, listener);
            }
        } else {
            listener(undefined);
        }
    }

    /**
     * Removes an event listener that is called on the end of a transition.
     * @param element The element whose events should no longer be listened to.
     * @param listener The listener to remove.
     */
    public static removeTransitionEndListener(element: HTMLElement, listener: EventListener): void {
        for (let event of transitionEndEvents) {
            element.removeEventListener(event, listener);
        }
    }

    /**
     * Calculates the required translation to place an element in the center of the viewport.
     * @param element The element.
     * @returns The calculated translation.
     */
    public static translateToCenter(element: Zoomable): string {
        const viewportWidth: number = Dimensions.viewportWidth();
        const viewportHeight: number = Dimensions.viewportHeight();

        const scrollX: number = Dimensions.scrollX();
        const scrollY: number = Dimensions.scrollY();

        const viewportX: number = viewportWidth / 2;
        const viewportY: number = scrollY + (viewportHeight / 2);

        const rect: ClientRect = element.getBoundingClientRect();
        const centerX: number = rect.left + scrollX + ((element.width || element.offsetWidth) / 2);
        const centerY: number = rect.top + scrollY + ((element.height || element.offsetHeight) / 2);

        const x: number = Math.round(viewportX - centerX);
        const y: number = Math.round(viewportY - centerY);

        return 'translate(' + x + 'px, ' + y + 'px) translateZ(0)';
    }

    /**
     * Calculates the required scale to fill the viewport with an element.
     * @param originalWidth The original width of the element.
     * @param width The width of the element.
     * @param height The height of the element.
     * @returns The calculated scale.
     */
    public static scaleToViewport(originalWidth: number, width: number, height: number): string {
        const viewportWidth: number = Dimensions.viewportWidth();
        const viewportHeight: number = Dimensions.viewportHeight();

        const viewportAspectRatio: number = viewportWidth / viewportHeight;

        const maxScaleFactor: number = width / originalWidth;
        const aspectRatio: number = width / height;

        let scaleFactor: number;

        if (width < viewportWidth && height < viewportHeight) {
            scaleFactor = maxScaleFactor;
        } else if (aspectRatio < viewportAspectRatio) {
            scaleFactor = (viewportHeight / height) * maxScaleFactor;
        } else {
            scaleFactor = (viewportWidth / width) * maxScaleFactor;
        }

        return 'scale(' + scaleFactor + ')';
    }
}
