export class Style {
    public static transform(element: HTMLElement, style: string): void {
        element.style.webkitTransform = style;
        element.style.transform = style;
    }
}
