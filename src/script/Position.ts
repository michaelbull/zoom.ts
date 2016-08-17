import { POSITION_MEMO_KEY } from './Attributes';

export class Position {
    private static origin: Position = new Position(0, 0);
    private static cache: {[key: number]: Position} = {};

    /*!
     * http://www.quirksmode.org/js/findpos.html
     */
    public static of(element: HTMLElement): Position {
        if (!element.offsetParent) {
            return Position.origin;
        }

        let key: string = element.getAttribute(POSITION_MEMO_KEY);
        if (key) {
            return Position.cache[key];
        }

        do {
            key = String(Math.random());
        } while (Position.cache[key]);

        element.setAttribute(POSITION_MEMO_KEY, key);
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
