import BaseElement from './base-element';
import { Point } from '../types';

abstract class BaseMovableElement extends BaseElement {
    public setPosition(position: Point) {
        this.position = position;
    }

    public setX(x: number) {
        this.position.x = x;
    }

    public setY(y: number) {
        this.position.y = y;
    }
}

export default BaseMovableElement;
