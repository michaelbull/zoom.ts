export function fullSrc(image: HTMLImageElement, attributeName: string): string {
    let fullSrc = image.getAttribute(attributeName);

    if (fullSrc === null) {
        return image.src;
    } else {
        return fullSrc;
    }
}
