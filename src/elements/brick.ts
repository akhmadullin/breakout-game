import BaseElement from './base-element';
import { Point, Color, Size } from '../types';

export enum BrickStatus {
    UnBroken,
    Broken,
}

class Brick extends BaseElement {
    private size: Size;

    private status: BrickStatus;

    constructor(
        ctx: CanvasRenderingContext2D,
        position: Point,
        color: Color,
        size: Size
    ) {
        super(ctx, position, color);
        this.size = size;
        this.status = BrickStatus.UnBroken;
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

    public getStatus() {
        return this.status;
    }

    public destroy() {
        this.status = BrickStatus.Broken;
    }
}

export default Brick;
