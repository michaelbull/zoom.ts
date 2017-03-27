import { Matrix } from '../Matrix';
import { vendorProperty } from '../Vendor';

export function transform(style: CSSStyleDeclaration, value: string): void {
    let property: string | null = vendorProperty(style, 'transform');

    if (property !== null) {
        (style as any)[property] = value;
    }
}

export function resetTransformation(style: CSSStyleDeclaration): void {
    transform(style, '');
}

function setBounds(style: CSSStyleDeclaration, x: string, y: string, width: string, height: string): void {
    style.left = x;
    style.top = y;
    style.width = width;
    style.maxWidth = width;
    style.height = height;
}

export function resetBounds(style: CSSStyleDeclaration): void {
    setBounds(style, '', '', '', '');
}

export function setBoundsPx(style: CSSStyleDeclaration, position: Matrix, size: Matrix): void {
    setBounds(style, `${position[0]}px`, `${position[1]}px`, `${size[0]}px`, `${size[1]}px`);
}

export function setHeightPx(style: CSSStyleDeclaration, height: number): void {
    style.height = `${height}px`;
}

export function unsetHeight(style: CSSStyleDeclaration): void {
    style.height = '';
}

export function translate(position: Matrix, use3d: boolean): string {
    if (use3d) {
        return `translate3d(${position[0]}px, ${position[1]}px, 0)`;
    } else {
        return `translate(${position[0]}px, ${position[1]}px)`;
    }
}

export function scaleAndTranslate(scale: number, position: Matrix, use3d: boolean): string {
    return `scale(${scale}) ${translate(position, use3d)}`;
}
