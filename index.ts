import './style.scss';
import { ready } from './lib/Document';
import { addZoomListener } from './lib/Zoom';

ready(document, () => addZoomListener(window));
