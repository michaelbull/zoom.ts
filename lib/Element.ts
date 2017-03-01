export function repaint(element: HTMLElement): void {
    // tslint:disable-next-line
    element.offsetHeight;
}

export function srcAttribute(wrapper: HTMLElement, image: HTMLImageElement): string {
    let attribute: string | null = wrapper.getAttribute('data-src');

    if (attribute !== null) {
        return attribute;
    }

    return image.src as string;
}
