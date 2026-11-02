
const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("game-message");
const startButton = document.getElementById("start-btn");

let score = 0;
let playerY = 0;
let velocity = 0;
let obstacleX = 0;
let speed = 5;
let running = false;
let jumping = false;
let animation;
let lastTime = 0;
let obstacleDelay = 0;

const ground = 55;

function startGame() {
    cancelAnimationFrame(animation);

    score = 0;
    playerY = 0;
    velocity = 0;
    speed = 5;
    obstacleX = document.querySelector(".game-screen").clientWidth;
    obstacleDelay = 0;
    lastTime = 0;
    jumping = false;
    running = true;

    player.style.bottom = ground + "px";
    obstacle.style.display = "block";
    message.style.display = "none";
    scoreDisplay.textContent = "0";

    animation = requestAnimationFrame(gameLoop);
}

function jump() {
    if (!running || jumping) return;

    velocity = 13;
    jumping = true;
}

function gameLoop(time) {
    if (!running) return;

    const delta = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
    lastTime = time;

    // Player physics
    playerY += velocity * delta;
    velocity -= 0.65 * delta;

    if (playerY <= 0) {
        playerY = 0;
        velocity = 0;
        jumping = false;
    }

    player.style.bottom = (ground + playerY) + "px";

    // Obstacle movement
    obstacleX -= speed * delta;

    if (obstacleX < -45) {
        obstacleX = document.querySelector(".game-screen").clientWidth + 30;
        score += 10;
        speed = Math.min(5 + score / 100, 12);
        obstacleDelay = 0;
        scoreDisplay.textContent = score;
    }

    obstacle.style.left = obstacleX + "px";
    obstacle.style.right = "auto";

    // Collision detection
    const playerBox = player.getBoundingClientRect();
    const obstacleBox = obstacle.getBoundingClientRect();

    const hit =
        playerBox.right - 10 > obstacleBox.left + 8 &&
        playerBox.left + 10 < obstacleBox.right - 8 &&
        playerBox.bottom - 5 > obstacleBox.top + 8;

    if (hit) {
        endGame();
        return;
    }

    animation = requestAnimationFrame(gameLoop);
}

function endGame() {
    running = false;
    cancelAnimationFrame(animation);

    obstacle.style.display = "none";

    const best = Math.max(
        score,
        Number(localStorage.getItem("rotuBest") || 0)
    );

    localStorage.setItem("rotuBest", best);

    message.innerHTML = `
        <h2>GAME OVER!</h2>
        <p>YOUR SCORE: ${score}</p>
        <p>BEST SCORE: ${best}</p>
        <button onclick="startGame()">PLAY AGAIN</button>
    `;

    message.style.display = "flex";
}

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        jump();
    }
});

document.querySelector(".game-screen").addEventListener("pointerdown", (event) => {
    if (event.target.tagName !== "BUTTON") {
        jump();
    }
});
