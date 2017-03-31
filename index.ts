import { addZoomListener } from './lib/Zoom';
import './style.scss';
import { ready } from './lib/Document';

ready(document, () => addZoomListener());
