import BaseMovableElement from './base-movable-element';
import { Point, Color, Size } from '../types';

type PaddleOptions = Point &
    Size & {
        shift: number;
        color: Color;
    };

class Paddle extends BaseMovableElement {
    private size: Size;

    private shift: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        { x, y, width, height, shift, color }: PaddleOptions
    ) {
        super(ctx, { x, y }, color);
        this.size = { width, height };
        this.shift = shift;
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
        this.position.x -= this.shift;
        if (this.position.x < 0) {
            this.position.x = 0;
        }
    }

    public moveRight() {
        this.position.x += this.shift;
        if (this.position.x + this.size.width > this.ctx.canvas.width) {
            this.position.x = this.ctx.canvas.width - this.size.width;
        }
    }

    get width(): number {
        return this.size.width;
    }
}

export default Paddle;
