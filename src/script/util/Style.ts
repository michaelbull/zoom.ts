/**
 * Contains {@link Style} related utility methods.
 */
export class Style {

    /**
     * Sets an elements transform style property.
     * @param element The element to style.
     * @param style The style to apply to the transform property.
     */
    public static transform(element: HTMLElement, style: string): void {
        element.style.webkitTransform = style;
        element.style.transform = style;
    }
}
