import Ball from './elements/ball';
import Paddle from './elements/paddle';
import Brick, { BrickStatus } from './elements/brick';
import Bricks from './elements/bricks';
import ScoreBoard from './elements/score-board';
import { Level } from './types';
import { blue, font, paddleWidth, paddleHeight } from './constants';

enum GameStatus {
    Active,
    Win,
    GameOver,
}

class BreakoutGame {
    private ctx: CanvasRenderingContext2D;

    private levels: Level[];

    private ball: Ball;

    private paddle: Paddle;

    private bricks: Bricks;

    private score: ScoreBoard;

    private level: ScoreBoard;

    private lives: ScoreBoard;

    private status: GameStatus;

    private isRightArrowPressed: boolean;

    private isLeftArrowPressed: boolean;

    private isStopped: boolean;

    constructor(ctx: CanvasRenderingContext2D, levels: Level[]) {
        this.ctx = ctx;
        this.levels = levels;

        this.score = new ScoreBoard(
            ctx,
            { x: 8, y: 20 },
            blue,
            font,
            'Score',
            0
        );

        this.level = new ScoreBoard(
            ctx,
            { x: ctx.canvas.width / 2 - 25, y: 20 },
            blue,
            font,
            'Level',
            1
        );

        this.lives = new ScoreBoard(
            ctx,
            { x: ctx.canvas.width - 65, y: 20 },
            blue,
            font,
            'Lives',
            3
        );

        this.ball = new Ball(ctx, {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height - 30,
            deltaX: this.currentLevelOptions.ballSpeed,
            deltaY: -this.currentLevelOptions.ballSpeed,
            color: blue,
            radius: 10,
        });

        this.paddle = new Paddle(ctx, {
            x: (ctx.canvas.width - paddleWidth) / 2,
            y: ctx.canvas.height - paddleHeight,
            width: paddleWidth,
            height: paddleHeight,
            shift: 7,
            color: blue,
        });

        this.bricks = new Bricks(ctx, this.currentLevelOptions.bricks);

        this.status = GameStatus.Active;

        this.isRightArrowPressed = false;
        this.isLeftArrowPressed = false;

        this.isStopped = false;

        this.activateControls();
    }

    private get currentLevelOptions() {
        return this.levels[this.level.getValue() - 1];
    }

    private upLevel() {
        if (this.level.getValue() === this.levels.length) {
            this.status = GameStatus.Win;
        } else {
            this.level.increase();
            const levelOptions = this.currentLevelOptions;
            this.bricks = new Bricks(this.ctx, levelOptions.bricks);
            this.ball.setPosition({
                x: this.ctx.canvas.width / 2,
                y: this.ctx.canvas.height - 30,
            });
            this.ball.setDelta({
                x: levelOptions.ballSpeed,
                y: -levelOptions.ballSpeed,
            });
            this.paddle.setX((this.ctx.canvas.width - this.paddle.width) / 2);
        }
    }

    private activateControls() {
        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                this.isRightArrowPressed = true;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                this.isLeftArrowPressed = true;
            }
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                this.isRightArrowPressed = false;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                this.isLeftArrowPressed = false;
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);

        const mouseMoveHandler = (e: MouseEvent) => {
            const relativeX = e.clientX - this.ctx.canvas.offsetLeft;
            this.paddle.moveByMouse(relativeX);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
    }

    private collisionDetection = () => {
        const bricks = this.bricks.getItems();
        for (let idx = 0; idx < bricks.length; idx++) {
            const brick = bricks[idx];

            if (brick.getStatus() === BrickStatus.Broken) {
                continue;
            }

            if (
                this.ball.x > brick.x &&
                this.ball.x < brick.x + brick.width &&
                this.ball.y > brick.y &&
                this.ball.y < brick.y + brick.height
            ) {
                this.ball.invertDeltaY();
                brick.destroy();
                this.score.increase();

                if (this.bricks.allBroken()) {
                    this.upLevel();
                }
            }
        }
    };

    public draw() {
        if (this.isStopped) {
            return;
        }

        this.cleanCanvas();

        this.bricks.draw();
        this.ball.draw();
        this.paddle.draw();
        this.score.draw();
        this.level.draw();
        this.lives.draw();

        if (this.status === GameStatus.Win) {
            alert('YOU WIN, CONGRATULATIONS!');
            this.isStopped = true;
            document.location.reload();
            return;
        }

        if (this.status === GameStatus.GameOver) {
            alert('GAME OVER');
            this.isStopped = true;
            document.location.reload();
            return;
        }

        this.collisionDetection();

        if (this.ballReachedLeft() || this.ballReachedRight()) {
            this.ball.invertDeltaX();
        }

        if (this.ballReachedTop()) {
            this.ball.invertDeltaY();
        } else if (this.ballReachedPaddle()) {
            this.ball.invertDeltaY();
        } else if (this.ballReachedBottom()) {
            this.lives.descrease();
            if (!this.lives.getValue()) {
                this.status = GameStatus.GameOver;
            } else {
                this.ball.setPosition({
                    x: this.ctx.canvas.width / 2,
                    y: this.ctx.canvas.height - 30,
                });
                this.ball.setDelta({
                    x: this.currentLevelOptions.ballSpeed,
                    y: -this.currentLevelOptions.ballSpeed,
                });
                this.paddle.setX(
                    (this.ctx.canvas.width - this.paddle.width) / 2
                );
            }
        }

        if (this.isRightArrowPressed) {
            this.paddle.moveRight();
        }

        if (this.isLeftArrowPressed) {
            this.paddle.moveLeft();
        }

        this.ball.move();
    }

    private cleanCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    private ballReachedLeft(): boolean {
        return this.ball.x + this.ball.deltaX < this.ball.radius;
    }

    private ballReachedRight(): boolean {
        return (
            this.ball.x + this.ball.deltaX >
            this.ctx.canvas.width - this.ball.radius
        );
    }

    private ballReachedTop(): boolean {
        return this.ball.y + this.ball.deltaY < this.ball.radius;
    }

    private ballReachedBottom(): boolean {
        return (
            this.ball.y + this.ball.deltaY >
            this.ctx.canvas.height - this.ball.radius
        );
    }

    private ballReachedPaddle(): boolean {
        return (
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width &&
            this.ball.y >= this.paddle.y
        );
    }
}

export default BreakoutGame;
