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

export function classesFrom(className: string): string[] {
    return className.split(' ');
}

function excludeClass(exclude: string): (className: string) => boolean {
    return (className: string): boolean => {
        return className !== exclude;
    };
}

let excludeEmptyClass: (className: string) => boolean = excludeClass('');

export function joinClasses(classes: string[]): string {
    return classes
        .filter(excludeEmptyClass)
        .join(' ');
}

export function truncateClass(classes: string[], toExclude: string): string {
    return classes
        .filter(excludeClass(toExclude))
        .filter(excludeEmptyClass)
        .join(' ');
}

export function addClass(element: HTMLElement, add: string): void {
    element.className = joinClasses([element.className, add]);
}

export function removeClass(element: HTMLElement, remove: string): void {
    element.className = truncateClass(classesFrom(element.className), remove);
}
