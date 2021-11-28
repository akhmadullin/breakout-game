import Brick, { BrickStatus } from './brick';

class Bricks {
    private items: Brick[][];

    constructor(items: Brick[][]) {
        this.items = items;
    }

    public draw() {
        for (let c = 0; c < this.items.length; c++) {
            for (let r = 0; r < this.items[0].length; r++) {
                const brick = this.items[c][r];

                if (brick.getStatus() === BrickStatus.Broken) {
                    continue;
                }

                brick.draw();
            }
        }
    }

    public getItems(): Brick[][] {
        return this.items;
    }

    get amount(): number {
        return this.items.length * this.items[0].length;
    }
}

export default Bricks;
