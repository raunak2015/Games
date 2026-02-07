var currentScore = document.querySelector('#currentScore');
var highScore = document.querySelector('#highScore');
var timer = document.querySelector('#timer');
var clickButton = document.querySelector('#clickButton');
var startButton = document.querySelector('#startButton');
var pauseButton = document.querySelector('#pauseButton');
var resetButton = document.querySelector('#resetButton');
var statusMessage = document.querySelector('#statusMessage');

var body = document.querySelector('body');


var current = 0;
var high = 0;
var time1 = 10;
var track = false;
var idTrack = null;
var paused = false;
function loadContent() {
    dataLoad();
    displayMessage();
}

function dataLoad() {
    var temp = localStorage.getItem('highScore');
    if (temp != null) {
        high = parseInt(temp);
    } else {
        high = 0;
    }
}

function displayMessage() {
    currentScore.textContent = current;
    highScore.textContent = high;
    timer.textContent = time1;
}

function statuMsg(msg) {
    statusMessage.textContent = msg;
}


function endGame() {
    clearInterval(idTrack);
    track = false;
    clickButton.disabled = true;
    startButton.disabled = false;
    pauseButton.disabled = true;
    startButton.innerHTML = "Play Again"
    clickButton.style.transform = 'scale(1)';
    if (current > high) {
        localStorage.setItem('highScore', current);
        high = current; // Keep this line to update the 'high' variable
        triggerCelebration();
        displayMessage();
        // statuMsg call removed to prevent overwriting "New High Score!"
        // setInterval()
    } else {
        statuMsg(`Oops! Your score is lower than your high score. Try again! \n You clicked ${current / 10} times per second!`);
    }
}

function startGame() {

    track = true;
    paused = false;
    time1 = 10;
    current = 0;
    clickButton.style.transform = 'scale(1)';
    currentScore.style.color = 'white'
    clickButton.disabled = false;
    startButton.disabled = true;
    pauseButton.disabled = false;
    statuMsg(" Game started! Click as fast as you can!");

    idTrack = setInterval(function () {
        if (!paused) {
            time1--;
            if (time1 <= 0) {
                endGame();
            }
            displayMessage();
        }
    }, 1000);
}

function clickMe() {
    if (track && !paused) {
        current++;

        if (current > high) {
            currentScore.style.color = '#ff4444' // Neon red
        }
        if (current < 11) {
            clickButton.style.transform = `scale(1.${current})`;
        }
        else {
            clickButton.style.transform = 'scale(1)';
        }
        displayMessage();
    }
}

function pauseGame() {
    if (!track) return;
    paused = !paused;
    if (paused) {
        statuMsg("⏸ Game paused! Click resume to continue!");
        pauseButton.textContent = "Resume";
        clickButton.disabled = true;
    } else {
        statuMsg(" Game resumed! Keep clicking!");
        pauseButton.textContent = "Pause";
        clickButton.disabled = false;
    }
}

function resetGame() {
    localStorage.removeItem('highScore');
    high = 0;
    current = 0;
    time1 = 10;
    displayMessage();
    statuMsg(" Game has been reset. Ready for a fresh start! ");
    clearInterval(idTrack);

    track = false;
    paused = false;
    startButton.disabled = false;
    clickButton.disabled = true;
    pauseButton.disabled = true;
    pauseButton.textContent = "Pause";
}

startButton.addEventListener('click', startGame);
clickButton.addEventListener('click', clickMe);
pauseButton.addEventListener('click', pauseGame);
resetButton.addEventListener('click', resetGame);
window.addEventListener('load', loadContent);

function triggerCelebration() {
    // 1. Background Glow
    body.classList.add('celebration-mode');

    // 2. Score Animation
    currentScore.classList.add('high-score-anim');
    highScore.classList.add('high-score-anim');

    // 3. Message
    statuMsg("🎉 New High Score! 🎉");

    // 4. Confetti Effect
    const colors = ['#00f3ff', '#bc13fe', '#ffd700', '#ff0055', '#ffffff'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animDuration = (Math.random() * 1 + 1.5) + 's'; // 1.5s - 2.5s
        const animDelay = (Math.random() * 0.5) + 's';

        confetti.style.backgroundColor = bg;
        confetti.style.left = left;
        confetti.style.animationDuration = animDuration;
        confetti.style.animationDelay = animDelay;

        document.body.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 2500);
    }

    // 5. Cleanup
    setTimeout(() => {
        body.classList.remove('celebration-mode');
        currentScore.classList.remove('high-score-anim');
        highScore.classList.remove('high-score-anim');
        // Optional: Reset message if you want, but "New High Score" is nice to keep until they play again
    }, 2500);
}