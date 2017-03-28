const CLASS_SEPARATOR: string = ' ';

export function classesFrom(classList: string): string[] {
    return classList.split(CLASS_SEPARATOR);
}

export function classNotEmpty(className: string): boolean {
    return className.length > 0;
}

export function joinClasses(classes: string[]): string {
    return classes
        .filter(classNotEmpty)
        .join(CLASS_SEPARATOR);
}

export function truncateClass(exclude: string, classes: string[]): string {
    return classes
        .filter((className: string) => classNotEmpty(className) && className !== exclude)
        .join(CLASS_SEPARATOR);
}

export function hasClass(element: HTMLElement, name: string): boolean {
    return element.className.indexOf(name) !== -1;
}

export function addClass(element: HTMLElement, className: string): void {
    element.className = joinClasses([element.className, className]);
}

export function removeClass(element: HTMLElement, className: string): void {
    element.className = truncateClass(className, classesFrom(element.className));
}
