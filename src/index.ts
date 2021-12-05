import BreakoutGame, { GameStatus } from './breakout-game';
import levels from './levels';

const canvas = document.querySelector<HTMLCanvasElement>('#gameCanvas')!;
const ctx = canvas.getContext('2d')!;

const game = new BreakoutGame(ctx, levels);

const draw = () => {
    game.play();

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
