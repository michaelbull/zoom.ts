import {
    scale,
    scale3d
} from './scale';
import { Transformation } from './Transformation';
import {
    translate,
    translate3d
} from './translate';

export function transform(transformation: Transformation): string {
    return `${scale(transformation.scale)} ${translate(transformation.translate)}`;
}

export function transform3d(transformation: Transformation): string {
    return `${scale3d(transformation.scale)} ${translate3d(transformation.translate)}`;
}
