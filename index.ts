import { addZoomListener } from './lib/Zoom';
import './style.scss';
import { ready } from './lib/window/Document';

ready(document, () => addZoomListener());
