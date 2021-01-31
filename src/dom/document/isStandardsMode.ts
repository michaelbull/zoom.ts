export const QUIRKS_MODE = 'BackCompat';
export const STANDARDS_MODE = 'CSS1Compat';

export function isStandardsMode(doc: Document = document): boolean {
    return doc.compatMode === STANDARDS_MODE;
}
