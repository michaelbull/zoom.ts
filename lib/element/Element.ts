import { Matrix } from '../Matrix';

export function repaint(element: HTMLElement): void {
    // tslint:disable-next-line
    element.offsetHeight;
}

export function clientDimensions(element: HTMLElement): Matrix {
    return [
        element.clientWidth,
        element.clientHeight
    ];
}

function dimension(element: HTMLElement, dimension: string): number {
    let value: string | null = element.getAttribute(`data-${dimension}`);
    return value === null ? Infinity : Number(value);
}

export function targetDimensions(element: HTMLElement): Matrix {
    return [
        dimension(element, 'width'),
        dimension(element, 'height')
    ];
}

export function hasClass(element: HTMLElement, name: string): boolean {
    return element.className.indexOf(name) !== -1;
}

export function addClass(element: HTMLElement, name: string): void {
    if (element.className.length === 0) {
        element.className = name;
    } else {
        element.className += ` ${name}`;
    }
}

export function removeClass(element: HTMLElement, name: string): void {
    let existing: string = element.className;
    let multipleClasses: boolean = existing.indexOf(' ') !== -1;

    if (multipleClasses) {
        let classes: string[] = existing.split(' ');
        let index: number = classes.indexOf(name);

        if (index !== -1) {
            classes.splice(index, 1);
            element.className = classes.join(' ');
        }
    } else if (existing === name) {
        element.className = '';
    }
}
