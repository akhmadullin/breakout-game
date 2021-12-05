import BaseMovableElement from './base-movable-element';
import { Point } from '../types';

type BallOptions = {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    color: string;
    radius: number;
};

class Ball extends BaseMovableElement {
    private delta: Point;

    public radius: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        { x, y, deltaX, deltaY, color, radius }: BallOptions
    ) {
        super(ctx, { x, y }, color);
        this.delta = { x: deltaX, y: deltaY };
        this.radius = radius;
    }

    public draw() {
        this.ctx.beginPath();
        this.ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        );
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    public setDelta(delta: Point) {
        this.delta = delta;
    }

    get deltaX(): number {
        return this.delta.x;
    }

    get deltaY(): number {
        return this.delta.y;
    }

    public invertDeltaX() {
        this.delta.x = -this.delta.x;
    }

    public invertDeltaY() {
        this.delta.y = -this.delta.y;
    }

    public move() {
        this.position = {
            x: this.position.x + this.delta.x,
            y: this.position.y + this.delta.y,
        };
    }
}

export default Ball;
