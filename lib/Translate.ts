import { transformProperty } from './Transform';
import { ready } from './Document';

const hasTranslate3d: boolean = ready(() => {
    if (transformProperty === undefined || window.getComputedStyle === undefined) {
        return false;
    }

    let map: { [key: string]: string } = {
        WebkitTransform: '-webkit-transform',
        MozTransform: '-moz-transform',
        msTransform: '-ms-transform',
        OTransform: '-o-transform',
        transform: 'transform'
    };

    let element: HTMLDivElement = document.createElement('div');
    element.style.setProperty(transformProperty, 'translate3d(1px,1px,1px)');
    document.body.insertBefore(element, null);
    let value: string = getComputedStyle(element).getPropertyValue(map[transformProperty]);
    document.body.removeChild(element);
    return value.length > 0 && value !== 'none';
});

export function translate(x: number, y: number): string {
    return hasTranslate3d ? `translate3d(${x}px, ${y}px, 0)` : `translate(${x}px, ${y}px)`;
}
