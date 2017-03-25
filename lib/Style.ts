import { vendorProperty } from './Vendor';

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

export function setBoundsPx(style: CSSStyleDeclaration, x: number, y: number, width: number, height: number): void {
    setBounds(style, `${x}px`, `${y}px`, `${width}px`, `${height}px`);
}

export function freezeWrapperHeight(wrapper: HTMLElement, image: HTMLImageElement): void {
    wrapper.style.height = `${image.height}px`;
}

export function unfreezeWrapperHeight(wrapper: HTMLElement): void {
    wrapper.style.height = '';
}
