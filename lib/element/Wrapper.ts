import { Config } from '../Config';
import { hasClass } from './ClassList';

export function isWrapperTransitioning(config: Config, wrapper: HTMLElement): boolean {
    return hasClass(wrapper, config.wrapperExpandingClass) || hasClass(wrapper, config.wrapperCollapsingClass);
}
