import BreakoutGame from './breakout-game';
import levels from './levels';

const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!;
const ctx = canvas.getContext('2d')!;

const game = new BreakoutGame(ctx, levels);

const draw = () => {
    game.draw();
    requestAnimationFrame(draw);
};

draw();

// game.draw();
