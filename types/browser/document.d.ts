import { Vector2 } from '../math/vector2';
export declare const QUIRKS_MODE = "BackCompat";
export declare const STANDARDS_MODE = "CSS1Compat";
export declare function isStandardsMode(doc?: Document): boolean;
export declare function rootElement(doc?: Document): HTMLElement;
export declare function viewportSize(doc?: Document): Vector2;
/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param callback The function to execute.
 * @param doc The document.
 * @see http://youmightnotneedjquery.com/#ready
 */
export declare function ready(callback: () => void, doc?: Document): void;
