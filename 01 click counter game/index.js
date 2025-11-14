var currentScore = document.querySelector('#currentScore');
var highScore = document.querySelector('#highScore');
var timer = document.querySelector('#timer');
var clickButton = document.querySelector('#clickButton');
var startButton = document.querySelector('#startButton');
var pauseButton = document.querySelector('#pauseButton');
var resetButton = document.querySelector('#resetButton');
var statusMessage = document.querySelector('#statusMessage');
// var video = document.getElementById("video");
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
// function playvideo() {
//     video.style.display = "block";
// }

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
        high = current;
        body.style.background = "gold";

        
        setTimeout(() => {
            body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        }, 1000);
        // playvideo();
        displayMessage();
        statuMsg(`Great job! Your score is higher than the previous one! \n You clicked ${current / 10} times per second!`);
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
    video.style.display = "none";
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

        if (current > 20) {
            currentScore.style.color = 'red'
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
    video.style.display = "none";
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