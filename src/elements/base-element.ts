import { Point, Color } from '../types';

abstract class BaseElement {
    protected ctx: CanvasRenderingContext2D;

    protected position: Point;

    protected color: Color;

    constructor(ctx: CanvasRenderingContext2D, position: Point, color: Color) {
        this.ctx = ctx;
        this.position = position;
        this.color = color;
    }

    public abstract draw(): void;

    public getX(): number {
        return this.position.x;
    }

    public getY(): number {
        return this.position.y;
    }
}

export default BaseElement;
