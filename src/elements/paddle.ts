import BaseMovableElement from './base-movable-element';
import { Point, Color, Size } from '../types';

class Paddle extends BaseMovableElement {
    private size: Size;

    constructor(
        ctx: CanvasRenderingContext2D,
        position: Point,
        color: Color,
        size: Size
    ) {
        super(ctx, position, color);
        this.size = size;
    }

    public draw() {
        this.ctx.beginPath();
        this.ctx.rect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    public moveLeft() {
        this.position.x -= this.delta.x;
        if (this.position.x < 0) {
            this.position.x = 0;
        }
    }

    public moveRight() {
        this.position.x += this.delta.x;
        if (this.position.x + this.size.width > this.ctx.canvas.width) {
            this.position.x = this.ctx.canvas.width - this.size.width;
        }
    }
}

export default Paddle;