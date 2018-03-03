import '../style.scss';
import { ready } from './browser/Document';
import { Features } from './browser/Features';
import {
    Config,
    DEFAULT_CONFIG
} from './Config';
import { ZoomListener } from './event/ZoomListener';

export function listen(config: Config = DEFAULT_CONFIG): void {
    ready(document, () => {
        let features = Features.of(document.body.style);
        let listener = new ZoomListener(config, features);
        document.body.addEventListener('click', listener);
    });
}
