/*!
 * http://www.quirksmode.org/js/findpos.html
 */

const MEMO_ATTR_KEY: string = 'data-offset-memo-key';

export class Position {
    private static origin: Position = new Position(0, 0);
    private static cache: {[key: number]: Position} = {};

    public static of(element: HTMLElement): Position {
        if (!element.offsetParent) {
            return Position.origin;
        }

        let key: string = element.getAttribute(MEMO_ATTR_KEY);
        if (key) {
            return Position.cache[key];
        }

        do {
            key = String(Math.random());
        } while (Position.cache[key]);

        element.setAttribute(MEMO_ATTR_KEY, key);
        Position.cache[key] = new Position(0, 0);

        let parent: HTMLElement = element;
        do {
            const position: Position = Position.cache[key];
            position._top += parent.offsetTop;
            position._left += parent.offsetLeft;
            parent = parent.offsetParent as HTMLElement;
        } while (parent);

        return Position.cache[key];
    }

    _top: number;
    _left: number;

    constructor(top: number, left: number) {
        this._top = top;
        this._left = left;
    }
}
