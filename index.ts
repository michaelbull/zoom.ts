import {
    Config,
    defaultConfig
} from './lib/Config';
import { ready } from './lib/window/Document';
import { addZoomListener } from './lib/Zoom';
import './style.scss';

let config: Config = defaultConfig();

ready(document, () => addZoomListener(config));
