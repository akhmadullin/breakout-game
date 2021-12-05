import { Point } from '../types';

abstract class BaseElement {
    protected ctx: CanvasRenderingContext2D;

    protected position: Point;

    protected color: string;

    constructor(ctx: CanvasRenderingContext2D, position: Point, color: string) {
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
