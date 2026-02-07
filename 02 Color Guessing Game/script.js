// --- Variables ---
const colorDisplay = document.querySelector('#colorDisplay');
const messageDisplay = document.querySelector('#message');
const currentStreakDisplay = document.querySelector('#currentStreak');
const bestStreakDisplay = document.querySelector('#bestStreak');
const colorBoxes = document.querySelectorAll('.color-box');
const newRoundBtn = document.querySelector('#newRoundBtn');
const easyBtn = document.querySelector('#easyBtn');
const hardBtn = document.querySelector('#hardBtn');
const resetStreakBtn = document.querySelector('#resetStreakBtn');
const container = document.querySelector('.color-box-container');

let currentStreak = 0;
let bestStreak = 0;
let colors = [];
let correctColor = "";
let numSquares = 6;
let gameActive = true;

// --- Initialization ---

function init() {
    setupModeButtons();
    setupColorBoxes();
    resetGame();
    loadBestStreak();
}

function loadBestStreak() {
    const storedBest = localStorage.getItem('bestStreak');
    if (storedBest) {
        bestStreak = parseInt(storedBest);
        bestStreakDisplay.textContent = bestStreak;
    }
}

// --- Event Listeners & Setup ---

function setupModeButtons() {
    [easyBtn, hardBtn].forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove 'selected' class from both
            easyBtn.classList.remove('selected');
            hardBtn.classList.remove('selected');
            // Add to clicked
            this.classList.add('selected');
            // Logic
            numSquares = (this.textContent === "Easy") ? 3 : 6;
            resetGame();
        });
    });
}

function setupColorBoxes() {
    colorBoxes.forEach(box => {
        box.addEventListener('click', function () {
            if (!gameActive) return;

            const clickedColor = this.style.backgroundColor;

            if (clickedColor === correctColor) {
                handleCorrectGuess(this);
            } else {
                handleWrongGuess(this);
            }
        });
    });
}

newRoundBtn.addEventListener('click', resetGame);

resetStreakBtn.addEventListener('click', function () {
    bestStreak = 0;
    bestStreakDisplay.textContent = 0;
    localStorage.setItem('bestStreak', 0);
    messageDisplay.textContent = "Streak Reset!";
    setTimeout(() => {
        if (messageDisplay.textContent === "Streak Reset!") messageDisplay.textContent = "";
    }, 1500);
});

// --- Game Logic ---

function resetGame() {
    gameActive = true;
    colors = generateRandomColors(numSquares);
    correctColor = pickColor();
    colorDisplay.textContent = correctColor;
    newRoundBtn.textContent = "New Colors";
    messageDisplay.textContent = "Pick a Color!";

    // Reset UI for boxes
    for (let i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].classList.remove('fade', 'shake');
        colorBoxes[i].style.opacity = '1';
        colorBoxes[i].style.pointerEvents = 'auto';

        if (colors[i]) {
            colorBoxes[i].style.display = 'block';
            colorBoxes[i].style.backgroundColor = colors[i];
        } else {
            colorBoxes[i].style.display = 'none';
        }
    }

    // Check if we need to show extra boxes for hard mode or hide for easy
    if (numSquares === 3) {
        for (let i = 3; i < 6; i++) colorBoxes[i].style.display = 'none';
    }
}

function handleCorrectGuess(clickedBox) {
    messageDisplay.textContent = "Correct!";
    changeColors(correctColor);
    gameActive = false;
    newRoundBtn.textContent = "Play Again?";

    // Streak Logic
    currentStreak++;
    currentStreakDisplay.textContent = currentStreak;

    // Trigger Success Animation on the clicked box
    clickedBox.style.transform = "scale(1.1)";
    setTimeout(() => clickedBox.style.transform = "scale(1)", 300);

    if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        bestStreakDisplay.textContent = bestStreak;
        localStorage.setItem('bestStreak', bestStreak);
        messageDisplay.textContent = "🎉 New Best Streak!";
        triggerConfetti();
    }

    // Auto-start next round
    setTimeout(() => {
        resetGame();
    }, 1500);
}

function handleWrongGuess(clickedBox) {
    clickedBox.classList.add('fade'); // Visual fade out
    clickedBox.classList.add('shake'); // Shake animation
    messageDisplay.textContent = "Try Again";

    // Remove shake class after animation so it can be re-triggered if clicked again (though pointer-events are removed by fade usually, depends on CSS)
    setTimeout(() => {
        clickedBox.classList.remove('shake');
    }, 500);

    // Reset current streak on wrong guess? 
    // Usually these games reset streak on loss. 
    if (currentStreak > 0) {
        currentStreak = 0;
        currentStreakDisplay.textContent = 0;
        messageDisplay.textContent = "Streak Lost!";
    }
}

function changeColors(color) {
    // Change all boxes to satisfy the visual win state
    colorBoxes.forEach(box => {
        box.style.backgroundColor = color;
        box.classList.remove('fade');
        box.style.opacity = '1';
    });
}

function generateRandomColors(num) {
    let arr = [];
    for (let i = 0; i < num; i++) {
        arr.push(randomColor());
    }
    return arr;
}

function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function pickColor() {
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

// --- Effects ---

function triggerConfetti() {
    const colors = ['#00f3ff', '#bc13fe', '#ffd700', '#ff0055', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

// Start Game
init();
