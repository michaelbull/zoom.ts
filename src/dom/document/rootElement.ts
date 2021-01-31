import { isStandardsMode } from './isStandardsMode';

export function rootElement(doc: Document = document): HTMLElement {
    return isStandardsMode(doc) ? doc.documentElement : doc.body;
}
