/**
 * Contains utility methods for calculating {@link Dimensions}.
 */
export class Dimensions {

    /**
     * Calculates the number of pixels in the document have been scrolled past horizontally.
     * @returns {number} The number of pixels in the document have been scrolled past horizontally.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX#Notes
     */
    public static scrollX(): number {
        if (window.pageXOffset === undefined) { // <IE9
            return (document.documentElement || document.body).scrollLeft;
        } else {
            return window.pageXOffset;
        }
    }

    /**
     * Calculates the number of pixels in the document have been scrolled past vertically.
     * @returns {number} The number of pixels in the document have been scrolled past vertically.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollX#Notes
     */
    public static scrollY(): number {
        if (window.pageYOffset === undefined) { // <IE9
            return (document.documentElement || document.body).scrollTop;
        } else {
            return window.pageYOffset;
        }
    }

    /**
     * Calculates the width (in pixels) of the browser window viewport.
     * @returns {number} The width (in pixels) of the browser window viewport.
     * @see https://stackoverflow.com/questions/9410088/how-do-i-get-innerwidth-in-internet-explorer-8/9410162#9410162
     */
    public static viewportWidth(): number {
        if (window.innerWidth === undefined) { // <IE9
            return (document.documentElement || document.body).clientWidth;
        } else {
            return window.innerWidth;
        }
    }

    /**
     * Calculates the height (in pixels) of the browser window viewport.
     * @returns {number} The height (in pixels) of the browser window viewport.
     * @see https://stackoverflow.com/questions/9410088/how-do-i-get-innerwidth-in-internet-explorer-8/9410162#9410162
     */
    public static viewportHeight(): number {
        if (window.innerHeight === undefined) { // <IE9
            return (document.documentElement || document.body).clientHeight;
        } else {
            return window.innerHeight;
        }
    }
}
