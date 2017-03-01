export function supportsTranslate3d(transformProperty: string): boolean {
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

    let element: HTMLDivElement = document.createElement('div');
    let style: any = element.style;

    style[transformProperty as string] = 'translate3d(1px,1px,1px)';
    document.body.insertBefore(element, null);

    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(element);
    let value: string = computedStyle.getPropertyValue(map[transformProperty as string]);
    document.body.removeChild(element);

    return value.length > 0 && value !== 'none';
}

export function translate3d(x: number, y: number): string {
    return `translate3d(${x}px, ${y}px, 0)`;
}

export function translate(x: number, y: number): string {
    return `translate(${x}px, ${y}px)`;
}
