const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas')!;
const ctx = canvas.getContext('2d')!;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

const blue = '#0095DD';

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleShift = 7;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;

type Point = {
    x: number;
    y: number;
};

enum BrickStatus {
    UnBroken,
    Broken,
}

type BrickPoint = Point & {
    status: BrickStatus;
};

const bricks: BrickPoint[][] = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: BrickStatus.UnBroken };
    }
}

const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
};

const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
};

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

const mouseMoveHandler = (e: MouseEvent) => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
};

document.addEventListener('mousemove', mouseMoveHandler);

const collisionDetection = () => {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];

            if (brick.status === BrickStatus.Broken) {
                continue;
            }

            if (
                x > brick.x &&
                x < brick.x + brickWidth &&
                y > brick.y &&
                y < brick.y + brickHeight
            ) {
                dy = -dy;
                brick.status = BrickStatus.Broken;
                score += 1;

                if (score === brickRowCount * brickColumnCount) {
                    alert('YOU WIN, CONGRATULATIONS!');
                    document.location.reload();
                }
            }
        }
    }
};

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = blue;
    ctx.fill();
    ctx.closePath();
};

const drawPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = blue;
    ctx.fill();
    ctx.closePath();
};

const drawBricks = () => {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = bricks[c][r];

            if (brick.status === BrickStatus.Broken) {
                continue;
            }

            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

            brick.x = brickX;
            brick.y = brickY;

            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = blue;
            ctx.fill();
            ctx.closePath();
        }
    }
};

const drawScore = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = blue;
    ctx.fillText(`Score: ${score}`, 8, 20);
};

const drawLives = () => {
    ctx.font = '16px Arial';
    ctx.fillStyle = blue;
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives -= 1;
            if (!lives) {
                alert('GAME OVER');

                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed) {
        paddleX += paddleShift;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }

    if (leftPressed) {
        paddleX -= paddleShift;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
};

draw();
