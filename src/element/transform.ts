import { vendorProperty } from '../browser/vendor';
import { pixels } from '../math/unit';
import { Vector2 } from '../math/vector2';

export function translate(translation: Vector2): string {
    let { x, y } = translation;
    return `translate(${x}px, ${y}px)`;
}

export function translate3d(translation: Vector2): string {
    let { x, y } = translation;
    return `translate3d(${x}px, ${y}px, 0)`;
}

export function scale(amount: number): string {
    return `scale(${amount})`;
}

export function scale3d(amount: number): string {
    return `scale3d(${amount}, ${amount}, 1)`;
}

export function supports3dTransformations(style: CSSStyleDeclaration): boolean {
    let perspectiveProperty = vendorProperty(style, 'perspective');

    if (perspectiveProperty !== undefined) {
        if ('WebkitPerspective' in style) {
            return testWebkitTransform3d();
        } else {
            return true;
        }
    }

    return false;
}

export const TEST3D_ID = 'test3d';
export const TEST3D_WIDTH = 4;
export const TEST3D_HEIGHT = 8;
export const TEST3D_STYLE = `` +
    `#${TEST3D_ID}{margin:0;padding:0;border:0;width:0;height:0}` +
    `@media (transform-3d),(-webkit-transform-3d){` +
    `#${TEST3D_ID}{width:${pixels(TEST3D_WIDTH)};height:${pixels(TEST3D_HEIGHT)}}` +
    `}`;

function testWebkitTransform3d(): boolean {
    let element = document.createElement('div');
    element.id = TEST3D_ID;

    // remove the test element from the document flow to avoid affecting document size
    element.style.position = 'absolute';

    let style = document.createElement('style');
    style.textContent = TEST3D_STYLE;

    let body = document.body;
    body.appendChild(style);
    body.appendChild(element);

    let offsetWidth = element.offsetWidth;
    let offsetHeight = element.offsetHeight;

    body.removeChild(style);
    body.removeChild(element);

    return offsetWidth === TEST3D_WIDTH && offsetHeight === TEST3D_HEIGHT;
}
