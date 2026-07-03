const cat = document.getElementById("cat");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const powerUpDisplay = document.getElementById("power-up");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const pauseButton = document.getElementById("pause-button");

let score = 0;
let highScore = 0;

let isPlaying = false;
let isPaused = false;

let gameInterval;
let gameTimeout;
let powerUpTimeout;

const gameDuration = 30000;

let remainingTime = gameDuration;
let startTime;

let currentPowerUp = null;

let lastPosition = {
    x: 0,
    y: 0
};

startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", stopGame);
pauseButton.addEventListener("click", togglePause);

cat.addEventListener("click", debounce(catchCat, 150));

document.addEventListener("keydown", handleKeyboard);

function startGame() {

    score = 0;
    scoreDisplay.textContent = score;

    isPlaying = true;
    isPaused = false;

    startButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false;

    pauseButton.textContent = "Pause Game";

    cat.style.display = "block";

    moveCat();

    gameInterval = setInterval(moveCat, 1000);

    startTime = Date.now();
    remainingTime = gameDuration;

    gameTimeout = setTimeout(endGame, remainingTime);

    spawnPowerUp();
}

function stopGame() {

    if (!isPlaying) return;

    if (confirm("Stop the current game?")) {
        endGame();
    }

}

function togglePause() {

    if (!isPlaying) return;

    if (isPaused) {

        isPaused = false;
        pauseButton.textContent = "Pause Game";

        startTime = Date.now();

        gameTimeout = setTimeout(endGame, remainingTime);

        gameInterval = setInterval(moveCat, 1000);

        spawnPowerUp();

    } else {

        isPaused = true;
        pauseButton.textContent = "Resume Game";

        clearInterval(gameInterval);
        clearTimeout(gameTimeout);
        clearTimeout(powerUpTimeout);

        remainingTime -= Date.now() - startTime;
    }

}

function catchCat() {

    if (!isPlaying || isPaused) return;

    if (currentPowerUp === "doublePoints") {
        score += 2;
    } else {
        score++;
    }

    scoreDisplay.textContent = score;

    moveCat();

}

function endGame() {

    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    clearTimeout(powerUpTimeout);

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }

    isPlaying = false;
    isPaused = false;

    currentPowerUp = null;

    powerUpDisplay.textContent = "None";

    cat.style.display = "none";

    startButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true;

    pauseButton.textContent = "Pause Game";

    alert(`🎉 Game Over!

Final Score: ${score}

High Score: ${highScore}`);

}

function moveCat() {

    if (isPaused) return;

    requestAnimationFrame(() => {

        if (currentPowerUp === "freeze") {

            cat.style.left = `${lastPosition.x}px`;
            cat.style.top = `${lastPosition.y}px`;
            return;
        }

        const speed = currentPowerUp === "slowDown" ? 0.5 : 1;

        const x = Math.random() * (window.innerWidth - cat.offsetWidth) * speed;
        const y = Math.random() * (window.innerHeight - cat.offsetHeight) * speed;

        cat.style.left = `${x}px`;
        cat.style.top = `${y}px`;

        lastPosition = { x, y };

    });

}

function spawnPowerUp() {

    const powerUps = [
        "doublePoints",
        "slowDown",
        "freeze"
    ];

    currentPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];

    powerUpDisplay.textContent = currentPowerUp;

    switch (currentPowerUp) {

        case "doublePoints":
            cat.style.border = "8px solid green";
            break;

        case "slowDown":
            cat.style.border = "8px solid blue";
            break;

        case "freeze":
            cat.style.border = "8px solid red";
            break;

    }

    setTimeout(() => {

        currentPowerUp = null;
        powerUpDisplay.textContent = "None";
        cat.style.border = "none";

    }, 5000);

    powerUpTimeout = setTimeout(spawnPowerUp, Math.random() * 10000 + 5000);

}

function handleKeyboard(event) {

    switch (event.code) {

        case "Space":

            if (!isPlaying)
                startGame();
            else
                catchCat();

            break;

        case "Escape":
            stopGame();
            break;

        case "KeyP":
            togglePause();
            break;

    }

}

function debounce(fn, delay) {

    let timeout;

    return (...args) => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            fn(...args);

        }, delay);

    };

}