import './style.scss';
import { ready } from './lib/Document';
import { start } from './lib/Zoom';

ready(document, () => start());
