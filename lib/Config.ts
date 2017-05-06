export interface Config {
    readonly scrollDismissPx: number;
    readonly cloneClass: string;
    readonly cloneVisibleClass: string;
    readonly cloneLoadedClass: string;
    readonly containerClass: string;
    readonly imageClass: string;
    readonly imageHiddenClass: string;
    readonly imageActiveClass: string;
    readonly overlayClass: string;
    readonly overlayVisibleClass: string;
    readonly wrapperClass: string;
    readonly wrapperExpandingClass: string;
    readonly wrapperExpandedClass: string;
    readonly wrapperCollapsingClass: string;
}

export const DEFAULT_CONFIG: Config = {
    scrollDismissPx: 50,
    cloneClass: 'zoom__clone',
    cloneVisibleClass: 'zoom__clone--visible',
    cloneLoadedClass: 'zoom__clone--loaded',
    containerClass: 'zoom__container',
    imageClass: 'zoom__element',
    imageHiddenClass: 'zoom__element--hidden',
    imageActiveClass: 'zoom__element--active',
    overlayClass: 'zoom__overlay',
    overlayVisibleClass: 'zoom__overlay--visible',
    wrapperClass: 'zoom',
    wrapperExpandingClass: 'zoom--expanding',
    wrapperExpandedClass: 'zoom--expanded',
    wrapperCollapsingClass: 'zoom--collapsing'
};
