import './style.scss';
import { ready } from './Document';
import { addListeners } from './Listener';

ready(() => {
    // console.log('zoom.ts loaded!');
    addListeners();
});
