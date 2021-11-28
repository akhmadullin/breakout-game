import BaseElement from './base-element';
import { Point, Color } from '../types';

class ScoreBoard extends BaseElement {
    private font: string;

    private label: string;

    private value: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        position: Point,
        color: Color,
        font: string,
        label: string,
        value: number
    ) {
        super(ctx, position, color);

        this.font = font;
        this.label = label;
        this.value = value;
    }

    public draw() {
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(
            `${this.label}: ${this.value}`,
            this.position.x,
            this.position.y
        );
    }

    public getValue(): number {
        return this.value;
    }

    public increase() {
        this.value += 1;
    }

    public descrease() {
        this.value -= 1;
    }
}

export default ScoreBoard;
