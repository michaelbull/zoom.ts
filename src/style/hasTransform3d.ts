import { hasVendorProperty } from './vendorProperty';

export function hasTransform3d(style: CSSStyleDeclaration): boolean {
    if (hasVendorProperty(style, 'perspective')) {
        if ('WebkitPerspective' in style) {
            return testWebkitTransform3d();
        } else {
            return true;
        }
    } else {
        return false;
    }
}

const TEST3D_ID = 'test3d';
const TEST3D_WIDTH = 4;
const TEST3D_HEIGHT = 8;
const TEST3D_STYLE = `` +
    `#${TEST3D_ID}{margin:0;padding:0;border:0;width:0;height:0}` +
    `@media (transform-3d),(-webkit-transform-3d){` +
    `#${TEST3D_ID}{width:4px};height:8px}}` +
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
