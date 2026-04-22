// FlappyPepe Game Logic

// Game variables
let bird;
let pipes = [];
let score = 0;
let gameOver = false;

// Setting up the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Bird properties
const birdHeight = 20;
const birdWidth = 20;
let birdY = canvas.height / 2;
let birdX = 50;
let birdVelocity = 0;
const gravity = 0.5;
const flapStrength = -8;

// Pipe properties
const pipeWidth = 50;
const pipeGap = 100;
const pipeSpeed = 2;

function setup() {
    // Initialize game
    document.addEventListener('keydown', flap);
    generatePipes();
    setInterval(update, 1000 / 60); // 60 frames per second
}

function flap() {
    if (!gameOver) {
        birdVelocity = flapStrength;
    } else {
        resetGame();
    }
}

function generatePipes() {
    let pipeHeight = Math.random() * (canvas.height - pipeGap - 20) + 10;
    pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - pipeGap
    });
}

function update() {
    if (gameOver) return;
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Move pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            score++;
            i--;
        }
    }

    // Check for collisions
    checkCollision();

    // Render everything
    render();
}

function checkCollision() {
    if (birdY + birdHeight > canvas.height || birdY < 0) {
        gameOver = true;
    }
    for (let pipe of pipes) {
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
            if (birdY < pipe.top || birdY + birdHeight > canvas.height - pipe.bottom) {
                gameOver = true;
            }
        }
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(birdX, birdY, birdWidth, birdHeight);

    // Draw pipes
    ctx.fillStyle = 'green';
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    }

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    // Check game over
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Press any key to restart', 50, canvas.height / 2);
    }
}

function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    generatePipes();
}

setup(); 
