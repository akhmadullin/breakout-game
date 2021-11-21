import BaseMovableElement from './base-movable-element';
import { Point, Color } from '../types';

class Ball extends BaseMovableElement {
    private radius: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        position: Point,
        color: Color,
        radius: number
    ) {
        super(ctx, position, color);
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

    public getRadius(): number {
        return this.radius;
    }

    public move() {
        this.position = {
            x: this.position.x + this.delta.x,
            y: this.position.y + this.delta.y,
        };
    }
}

export default Ball;
