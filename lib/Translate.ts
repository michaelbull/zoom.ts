export function translate(x: number, y: number, use3d: boolean): string {
    return use3d ? `translate3d(${x}px, ${y}px, 0)` : `translate(${x}px, ${y}px)`;
}

export function hasTranslate3d(element: HTMLElement, transformProperty: string): boolean {
    if (window.getComputedStyle === undefined) {
        return false;
    }

    let map: { [key: string]: string } = {
        WebkitTransform: '-webkit-transform',
        MozTransform: '-moz-transform',
        msTransform: '-ms-transform',
        OTransform: '-o-transform',
        transform: 'transform'
    };

    if (!(transformProperty in map)) {
        return false;
    }

    let child: HTMLDivElement = document.createElement('div');
    let style: any = child.style;

    style[transformProperty] = 'translate3d(1px,1px,1px)';
    element.insertBefore(child, null);

    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(child);
    let value: string = computedStyle.getPropertyValue(map[transformProperty as string]);
    element.removeChild(child);

    return value.length > 0 && value !== 'none';
}
