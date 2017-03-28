const CLASS_SEPARATOR: string = ' ';

function classesFrom(classList: string): string[] {
    return classList.split(CLASS_SEPARATOR);
}

function classNotEmpty(className: string): boolean {
    return className.length > 0;
}

export function joinClasses(classes: string[]): string {
    return classes
        .filter(classNotEmpty)
        .join(CLASS_SEPARATOR);
}

export function excludeClass(exclude: string, classes: string[]): string {
    return classes
        .filter((className: string) => classNotEmpty(className) && className !== exclude)
        .join(CLASS_SEPARATOR);
}

export function hasClass(element: HTMLElement, className: string): boolean {
    return element.className.indexOf(className) !== -1;
}

export function addClass(element: HTMLElement, className: string): void {
    element.className = joinClasses([element.className, className]);
}

export function removeClass(element: HTMLElement, className: string): void {
    element.className = excludeClass(className, classesFrom(element.className));
}
