/**
 * Executes a callback function when a document has finished loading, or immediately if the document has already
 * finished loading.
 * @param callback The function to execute.
 * @param doc The document.
 * @see http://youmightnotneedjquery.com/#ready
 */
export function ready(callback: () => void, doc: Document = document): void {
    if (doc.readyState === 'loading') {
        let listener = (): void => {
            doc.removeEventListener('DOMContentLoaded', listener);
            callback.call(doc);
        };

        doc.addEventListener('DOMContentLoaded', listener);
    } else {
        callback.call(doc);
    }
}
