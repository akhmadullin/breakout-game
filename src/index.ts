import BreakoutGame from './breakout-game';

const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!;
const ctx = canvas.getContext('2d')!;

const game = new BreakoutGame(ctx);

const draw = () => {
    game.draw();
    requestAnimationFrame(draw);
};

draw();

// game.draw();
