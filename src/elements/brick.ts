import BaseElement from './base-element';
import { Point, Color, Size } from '../types';

export enum BrickStatus {
    UnBroken,
    Broken,
}

type BrickOptions = Point &
    Size & {
        color: Color;
    };

class Brick extends BaseElement {
    private size: Size;

    private status: BrickStatus;

    constructor(
        ctx: CanvasRenderingContext2D,
        { x, y, width, height, color }: BrickOptions
    ) {
        super(ctx, { x, y }, color);
        this.size = { width, height };
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

    get width(): number {
        return this.size.width;
    }

    get height(): number {
        return this.size.height;
    }
}

export default Brick;
