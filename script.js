const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
let BOARD;

const SHAPES = [
    [[1, 1, 1, 1]], // I shape
    [[1, 1], [1, 1]], // O shape
    [[1, 1, 0], [0, 1, 1]], // S shape
    [[0, 1, 1], [1, 1, 0]], // Z shape
    [[1, 1, 1], [0, 1, 0]], // T shape
    [[1, 0, 0], [1, 1, 1]], // L shape
    [[0, 0, 1], [1, 1, 1]]  // J shape
];

const COLORS = ['cyan', 'yellow', 'green', 'red', 'blue', 'orange', 'purple'];

let currentShape, currentX, currentY, gameOver = false, gameInterval;

function initBoard() {
    BOARD = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (BOARD[r][c]) {
                ctx.fillStyle = BOARD[r][c];
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawShape() {
    ctx.fillStyle = currentShape.color;
    for (let r = 0; r < currentShape.matrix.length; r++) {
        for (let c = 0; c < currentShape.matrix[r].length; c++) {
            if (currentShape.matrix[r][c]) {
                ctx.fillRect((currentX + c) * BLOCK_SIZE, (currentY + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function createShape() {
    const index = Math.floor(Math.random() * SHAPES.length);
    const shapeMatrix = SHAPES[index];
    currentShape = {
        matrix: shapeMatrix,
        color: COLORS[index]
    };
    currentX = Math.floor(COLS / 2) - Math.floor(shapeMatrix[0].length / 2);
    currentY = 0;
}

function isValidMove() {
    for (let r = 0; r < currentShape.matrix.length; r++) {
        for (let c = 0; c < currentShape.matrix[r].length; c++) {
            if (currentShape.matrix[r][c]) {
                const x = currentX + c;
                const y = currentY + r;
                if (x < 0 || x >= COLS || y >= ROWS || BOARD[y][x]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placeShape() {
    for (let r = 0; r < currentShape.matrix.length; r++) {
        for (let c = 0; c < currentShape.matrix[r].length; c++) {
            if (currentShape.matrix[r][c]) {
                BOARD[currentY + r][currentX + c] = currentShape.color;
            }
        }
    }
    checkLines();
    createShape();
}

function checkLines() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (BOARD[r].every(cell => cell)) {
            BOARD.splice(r, 1);
            BOARD.unshift(Array(COLS).fill(null));
        }
    }
}

function rotateShape() {
    const rotatedShape = {
        matrix: currentShape.matrix[0].map((_, index) => currentShape.matrix.map(row => row[index])).reverse(),
        color: currentShape.color
    };
    const backupX = currentX;
    const backupY = currentY;
    currentShape = rotatedShape;
    if (!isValidMove()) {
        currentShape.matrix = rotatedShape.matrix.reverse();
    }
}

function moveShape(direction) {
    currentX += direction;
    if (!isValidMove()) {
        currentX -= direction;
    }
}

function dropShape() {
    currentY++;
    if (!isValidMove()) {
        currentY--;
        placeShape();
    }
}

function gameLoop() {
    if (gameOver) return;

    drawBoard();
    drawShape();
    dropShape();
}

function startGame() {
    initBoard();
    createShape();
    gameOver = false;
    gameInterval = setInterval(gameLoop, 1000 / 2);

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') moveShape(-1);
        if (event.key === 'ArrowRight') moveShape(1);
        if (event.key === 'ArrowDown') dropShape();
        if (event.key === 'ArrowUp') rotateShape();
    });
}

function restartGame() {
    clearInterval(gameInterval);
    gameOver = false;
    startGame();
}

document.getElementById('restartButton').addEventListener('click', restartGame);

startGame();
