import Brick, { BrickStatus, BrickOptions } from './brick';

class Bricks {
    private items: Brick[];

    constructor(ctx: CanvasRenderingContext2D, bricksOptions: BrickOptions[]) {
        this.items = bricksOptions.map((options) => new Brick(ctx, options));
    }

    public draw() {
        for (let idx = 0; idx < this.items.length; idx++) {
            const brick = this.items[idx];

            if (brick.getStatus() === BrickStatus.Broken) {
                continue;
            }

            brick.draw();
        }
    }

    public getItems() {
        return this.items;
    }

    public allBroken() {
        return this.items.every(
            (brick) => brick.getStatus() === BrickStatus.Broken
        );
    }
}

export default Bricks;
