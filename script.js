const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

// Размеры поля и блоков
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30; // Размер блока
const BOARD_WIDTH = COLS * BLOCK_SIZE;
const BOARD_HEIGHT = ROWS * BLOCK_SIZE;
canvas.width = BOARD_WIDTH;
canvas.height = BOARD_HEIGHT;

// Цвета блоков
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// Тетроминоы (формы)
const TETROMINOS = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]], // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]]  // L
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece = generatePiece();
let gameInterval;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                ctx.fillStyle = COLORS[board[row][col] - 1];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece() {
    const { shape, x, y } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                ctx.fillStyle = COLORS[currentPiece.color];
                ctx.fillRect((x + col) * BLOCK_SIZE, (y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function generatePiece() {
    const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
    return {
        shape: TETROMINOS[randomIndex],
        color: randomIndex,
        x: Math.floor(COLS / 2) - 1,
        y: 0
    };
}

function rotatePiece() {
    const shape = currentPiece.shape;
    const rotated = shape[0].map((_, index) => shape.map(row => row[index])).reverse();
    return rotated;
}

function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;

    if (isColliding()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;
        return false;
    }
    return true;
}

function dropPiece() {
    while (movePiece(0, 1)) {}
    placePiece();
}

function placePiece() {
    const { shape, x, y, color } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                board[y + row][x + col] = color + 1;
            }
        }
    }
    currentPiece = generatePiece();
    if (isColliding()) {
        clearBoard();
        alert('Game Over!');
    }
}

function isColliding() {
    const { shape, x, y } = currentPiece;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newX = x + col;
                const newY = y + row;
                if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY] && board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function clearBoard() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

function update() {
    if (!movePiece(0, 1)) {
        placePiece();
    }
    drawBoard();
    drawPiece();
}

function handleKeyPress(event) {
    if (event.key === 'ArrowLeft') {
        movePiece(-1, 0);
    } else if (event.key === 'ArrowRight') {
        movePiece(1, 0);
    } else if (event.key === 'ArrowDown') {
        movePiece(0, 1);
    } else if (event.key === 'ArrowUp') {
        const rotated = rotatePiece();
        currentPiece.shape = rotated;
        if (isColliding()) {
            currentPiece.shape = rotated.reverse();
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function startGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPiece = generatePiece();
    gameInterval = setInterval(update, 500);
}

function stopGame() {
    clearInterval(gameInterval);
}

document.getElementById('restartButton').addEventListener('click', () => {
    stopGame();
    startGame();
});

startGame();
