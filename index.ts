import './style.scss';
import { ready } from './lib/Document';
import { startListening } from './lib/Zoom';

ready(document, () => startListening());
