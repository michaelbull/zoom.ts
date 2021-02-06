import { Config } from './Config';

export const DEFAULT_CONFIG: Config = {
    scrollDismissPx: 50,
    clone: {
        classNames: {
            base: 'zoom__clone',
            visible: 'zoom__clone--visible',
            loaded: 'zoom__clone--loaded'
        }
    },
    container: {
        classNames: {
            base: 'zoom__container'
        }
    },
    image: {
        attributeNames: {
            width: 'data-width',
            height: 'data-height',
            src: 'data-src'
        },
        classNames: {
            base: 'zoom__image',
            hidden: 'zoom__image--hidden',
            active: 'zoom__image--active'
        }
    },
    overlay: {
        classNames: {
            base: 'zoom__overlay',
            visible: 'zoom__overlay--visible'
        }
    },
    wrapper: {
        classNames: {
            base: 'zoom',
            expanding: 'zoom--expanding',
            expanded: 'zoom--expanded',
            collapsing: 'zoom--collapsing'
        }
    }
};
