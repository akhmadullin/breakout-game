import BaseElement from './base-element';
import { Point, Color } from '../types';

abstract class BaseMovableElement extends BaseElement {
    protected delta: Point;

    // constructor(position: Point, color: Color, delta: Point) {
    constructor(ctx: CanvasRenderingContext2D, position: Point, color: Color) {
        super(ctx, position, color);

        this.delta = {
            x: 0,
            y: 0,
        };
    }

    public setDelta(delta: Point) {
        this.delta = delta;
    }

    public invertDeltaX() {
        this.delta.x = -this.delta.x;
    }

    public invertDeltaY() {
        this.delta.y = -this.delta.y;
    }

    public getDeltaX(): number {
        return this.delta.x;
    }

    public getDeltaY(): number {
        return this.delta.y;
    }

    public setPosition(position: Point) {
        this.position = position;
    }

    public setX(x: number) {
        this.position.x = x;
    }

    public setY(y: number) {
        this.position.y = y;
    }

    // public move() {
    //     this.position = {
    //         x: this.position.x + this.delta.x,
    //         y: this.position.y + this.delta.y,
    //     };
    // }
}

export default BaseMovableElement;
