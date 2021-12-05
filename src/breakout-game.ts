import Ball from './elements/ball';
import Paddle from './elements/paddle';
import { BrickStatus } from './elements/brick';
import Bricks from './elements/bricks';
import ScoreBoard from './elements/score-board';
import { Level } from './types';
import circleRectangleColliding from './circle-rectangle-colliding';
import { blue, font, arrowRight, arrowLeft, space } from './constants';

export enum GameStatus {
    Pause,
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

    public status: GameStatus;

    private isRightArrowPressed: boolean;

    private isLeftArrowPressed: boolean;

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
            x:
                (ctx.canvas.width - this.currentLevelOptions.paddleSize.width) /
                2,
            y: ctx.canvas.height - this.currentLevelOptions.paddleSize.height,
            width: this.currentLevelOptions.paddleSize.width,
            height: this.currentLevelOptions.paddleSize.height,
            shift: this.currentLevelOptions.paddleSpeed,
            color: blue,
        });

        this.bricks = new Bricks(ctx, this.currentLevelOptions.bricks);

        this.status = GameStatus.Pause;

        this.isRightArrowPressed = false;
        this.isLeftArrowPressed = false;

        this.activateControls();
    }

    private get currentLevelOptions() {
        return this.levels[this.level.getValue() - 1];
    }

    private activateControls() {
        const keyDownHandler = (e: KeyboardEvent) => {
            if (e.keyCode === arrowRight) {
                this.isRightArrowPressed = true;
                if (this.status === GameStatus.Pause) {
                    this.continue();
                }
            } else if (e.keyCode === arrowLeft) {
                this.isLeftArrowPressed = true;
                if (this.status === GameStatus.Pause) {
                    this.continue();
                }
            } else if (e.keyCode === space) {
                if (this.status === GameStatus.Pause) {
                    this.continue();
                } else if (this.status === GameStatus.Active) {
                    this.pause();
                }
            }
        };

        const keyUpHandler = (e: KeyboardEvent) => {
            if (e.keyCode === arrowRight) {
                this.isRightArrowPressed = false;
            } else if (e.keyCode === arrowLeft) {
                this.isLeftArrowPressed = false;
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        document.addEventListener('keyup', keyUpHandler);
    }

    private pause() {
        this.status = GameStatus.Pause;
    }

    private continue() {
        this.status = GameStatus.Active;
    }

    public play() {
        this.cleanCanvas();

        this.draw();

        if (this.status === GameStatus.Pause) {
            return;
        }

        this.detectBallCollisionWithBricks();

        this.detectBallCollistionWithPaddleAndBorders();

        this.moveElements();
    }

    private cleanCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    private draw() {
        this.bricks.draw();
        this.ball.draw();
        this.paddle.draw();
        this.score.draw();
        this.level.draw();
        this.lives.draw();
    }

    private detectBallCollisionWithBricks() {
        const bricks = this.bricks.getItems();
        for (let idx = 0; idx < bricks.length; idx++) {
            const brick = bricks[idx];

            if (brick.getStatus() === BrickStatus.Broken) {
                continue;
            }

            if (circleRectangleColliding(this.ball, brick)) {
                this.ball.invertDeltaY();
                brick.destroy();
                this.score.increase();

                if (this.bricks.allBroken()) {
                    this.upLevel();
                }
            }
        }
    }

    private upLevel() {
        if (this.level.getValue() === this.levels.length) {
            this.status = GameStatus.Win;
        } else {
            this.level.increase();

            this.bricks = new Bricks(this.ctx, this.currentLevelOptions.bricks);

            this.pause();

            this.setBallToInitialPosition();

            this.paddle.setSize(this.currentLevelOptions.paddleSize);
            this.paddle.setShift(this.currentLevelOptions.paddleSpeed);
            this.setPaddleToInitialPosition();
        }
    }

    private detectBallCollistionWithPaddleAndBorders() {
        if (this.ballReachedLeft() || this.ballReachedRight()) {
            this.ball.invertDeltaX();
        }

        if (this.ballReachedTop() || this.ballReachedPaddle()) {
            this.ball.invertDeltaY();
        }

        if (this.ballReachedBottom()) {
            this.attemptIsOver();
        }
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
        return circleRectangleColliding(this.ball, this.paddle);
    }

    private attemptIsOver() {
        this.lives.descrease();
        if (!this.lives.getValue()) {
            this.status = GameStatus.GameOver;
        } else {
            this.pause();

            this.setBallToInitialPosition();

            this.setPaddleToInitialPosition();
        }
    }

    private setBallToInitialPosition() {
        this.ball.setPosition({
            x: this.ctx.canvas.width / 2,
            y: this.ctx.canvas.height - 30,
        });
        this.ball.setDelta({
            x: this.currentLevelOptions.ballSpeed,
            y: -this.currentLevelOptions.ballSpeed,
        });
    }

    private setPaddleToInitialPosition() {
        this.paddle.setX((this.ctx.canvas.width - this.paddle.width) / 2);
    }

    private moveElements() {
        if (this.isRightArrowPressed) {
            this.paddle.moveRight();
        }

        if (this.isLeftArrowPressed) {
            this.paddle.moveLeft();
        }

        this.ball.move();
    }
}

export default BreakoutGame;
