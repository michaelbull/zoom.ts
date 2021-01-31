import { Vector2 } from '../../math';
import { clientSize } from '../element';
import { rootElement } from './rootElement';

export function viewportSize(doc: Document = document): Vector2 {
    return clientSize(rootElement(doc));
}
