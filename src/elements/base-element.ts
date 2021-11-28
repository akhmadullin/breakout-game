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

    get x(): number {
        return this.position.x;
    }

    get y(): number {
        return this.position.y;
    }
}

export default BaseElement;
