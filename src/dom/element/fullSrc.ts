export function fullSrc(image: HTMLImageElement): string {
    let fullSrc = image.getAttribute('data-src');

    if (fullSrc === null) {
        return image.src;
    } else {
        return fullSrc;
    }
}
