import './style.scss';
import { ready } from './lib/Document';
import { Listener } from './lib/Listener';

let listener: Listener = new Listener();

ready(() => listener.start());
