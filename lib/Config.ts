export interface Config {
    scrollDismissPx: number;
    cloneClass: string;
    cloneVisibleClass: string;
    cloneLoadedClass: string;
    containerClass: string;
    imageClass: string;
    imageHiddenClass: string;
    imageActiveClass: string;
    overlayClass: string;
    overlayVisibleClass: string;
    wrapperClass: string;
    wrapperExpandingClass: string;
    wrapperExpandedClass: string;
    wrapperCollapsingClass: string;
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
