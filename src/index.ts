import BreakoutGame, { GameStatus } from './breakout-game';
import levels from './levels';

const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!;
const ctx = canvas.getContext('2d')!;

const game = new BreakoutGame(ctx, levels);

const draw = () => {
    game.draw();

    if (game.status === GameStatus.Win) {
        alert('YOU WIN, CONGRATULATIONS!');
        document.location.reload();
        return;
    }

    if (game.status === GameStatus.GameOver) {
        alert('GAME OVER');
        document.location.reload();
        return;
    }

    requestAnimationFrame(draw);
};

draw();
