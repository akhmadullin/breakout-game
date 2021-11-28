import Ball from './elements/ball';
import Paddle from './elements/paddle';
import Brick, { BrickStatus } from './elements/brick';
import Bricks from './elements/bricks';
import ScoreBoard from './elements/score-board';
import { blue, font } from './constants';

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const paddleWidth = 75;

enum GameStatus {
    Active,
    Win,
    GameOver,
}

class BreakoutGame {
    private ctx: CanvasRenderingContext2D;

    private ball: Ball;

    private paddle: Paddle;

    private bricks: Bricks;

    private score: ScoreBoard;

    private lives: ScoreBoard;

    private status: GameStatus;

    private isRightArrowPressed: boolean;

    private isLeftArrowPressed: boolean;

    private isStopped: boolean;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;

        this.ball = new Ball(ctx, {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height - 30,
            deltaX: 2,
            deltaY: -2,
            color: blue,
            radius: 10,
        });

        this.paddle = new Paddle(ctx, {
            x: (ctx.canvas.width - paddleWidth) / 2,
            y: ctx.canvas.height - 10,
            width: paddleWidth,
            height: 10,
            shift: 7,
            color: blue,
        });
        //
        const bricks: Brick[][] = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                const brickX =
                    c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY =
                    r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r] = new Brick(ctx, {
                    x: brickX,
                    y: brickY,
                    width: brickWidth,
                    height: brickHeight,
                    color: blue,
                });
            }
        }
        this.bricks = new Bricks(bricks);
        //

        this.score = new ScoreBoard(
            ctx,
            { x: 8, y: 20 },
            blue,
            font,
            'Score',
            0
        );

        this.lives = new ScoreBoard(
            ctx,
            { x: ctx.canvas.width - 65, y: 20 },
            blue,
            font,
            'Lives',
            3
        );

        this.status = GameStatus.Active;

        this.isRightArrowPressed = false;
        this.isLeftArrowPressed = false;

        this.isStopped = false;

        this.activateControls();
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
        for (let c = 0; c < bricks.length; c++) {
            for (let r = 0; r < bricks[0].length; r++) {
                const brick = bricks[c][r];

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

                    if (this.score.getValue() === this.bricks.amount) {
                        this.status = GameStatus.Win;
                    }
                }
            }
        }
    };

    public draw() {
        if (this.isStopped) {
            return;
        }

        this.cleanCanvas();

        this.ball.draw();
        this.paddle.draw();
        this.bricks.draw();
        this.score.draw();
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
                this.ball.setDelta({ x: 2, y: -2 });
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
