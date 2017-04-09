export const CLASS_SEPARATOR: string = ' ';

export type ClassFilter = (className: string, index: number, classList: string[]) => boolean;

export function classFilter(className: string, index: number, classList: string[]): boolean {
    return className.length > 0 && classList.indexOf(className) === index;
}

export function excludeClass(excluded: string): ClassFilter {
    return (className: string, index: number, classList: string[]): boolean => {
        return className !== excluded && classFilter(className, index, classList);
    };
}

export function classesFrom(classList: string): string[] {
    return classList
        .split(CLASS_SEPARATOR)
        .filter(classFilter);
}

export function hasClass(element: HTMLElement, className: string): boolean {
    return element.className.indexOf(className) !== -1;
}

export function addClass(element: HTMLElement, add: string): void {
    element.className = classesFrom(element.className)
        .concat(add)
        .filter(classFilter)
        .join(CLASS_SEPARATOR);
}

export function removeClass(element: HTMLElement, remove: string): void {
    element.className = classesFrom(element.className)
        .filter(excludeClass(remove))
        .join(CLASS_SEPARATOR);
}
