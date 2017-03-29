const CLASS_SEPARATOR: string = ' ';

function classesFrom(classList: string): string[] {
    return classList.split(CLASS_SEPARATOR);
}

function classNotEmpty(className: string): boolean {
    return className.length > 0;
}

export function hasClass(element: HTMLElement, className: string): boolean {
    return element.className.indexOf(className) !== -1;
}

export function addClass(element: HTMLElement, add: string): void {
    element.className = classesFrom(element.className)
        .concat(add)
        .filter(classNotEmpty)
        .join(CLASS_SEPARATOR);
}

export function removeClass(element: HTMLElement, remove: string): void {
    element.className = classesFrom(element.className)
        .filter((className: string) => classNotEmpty(className) && className !== remove)
        .join(CLASS_SEPARATOR);
}
