const colorDisplay = document.querySelector('#colorDisplay');
const messageDisplay = document.querySelector('#message');
const currentStreakDisplay = document.querySelector('#currentStreak');
const bestStreakDisplay = document.querySelector('#bestStreak');

const colorBoxes = document.querySelectorAll('.color-box');
const newRoundBtn = document.querySelector('#newRoundBtn');

const easyBtn = document.querySelector('#easyBtn');
const hardBtn = document.querySelector('#hardBtn');
const resetStreakBtn = document.querySelector('#resetStreakBtn');
const btnTrack = document.querySelector('.color-box-container');

//variables

var currentStreak = 0;
var bestStreak = 0;
// var correctColor = null;
var pickCorrectColor = 0;
var color = [];
let num = 6;

// to call onLoad function and displayContent...
function webLoad() {
    onLoad();
    displayContent();
    setGame();
}

// whenever the webdite will load then first it will load entire data...
function onLoad() {
    var temp = localStorage.getItem('highBestStrak');
    if (temp != null) {
        bestStreak = parseInt(temp); // here the localStorage contain the dataso it will return the not null
    }
    else {
        bestStreak = 0; // if there is no data in localstorage so  it eill return null instead of number.
    }
}

// here we will define the display content massage in a function format..

function displayContent() {
    currentStreakDisplay.textContent = currentStreak;
    bestStreakDisplay.textContent = bestStreak;
}

//random color genrator
function colorGenerate() {
    var a = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var c = Math.floor(Math.random() * 256);
    return `rgb(${a}, ${b}, ${c})`;
}

function genrateColor(num) {
    const arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(colorGenerate());
    }
    return arr;
}

function pickGenerator() {
    const math = Math.floor(Math.random() * color.length)
    return color[math];
}
function setGame() {
    color = genrateColor(num); // Color -> emty array -->main pupose to store the 
    pickCorrectColor = pickGenerator();
    console.log(color);
    console.log(pickCorrectColor);
    colorDisplay.textContent = pickCorrectColor;
    for (var i = 0; i < color.length; i++) {
        colorBoxes[i].style.backgroundColor = color[i];
        colorBoxes[i].style.pointerEvents = 'auto';
        colorBoxes[i].style.opacity = '1';
    }
}

webLoad();

function interval() {
    for (var i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].style.backgroundColor = pickCorrectColor
    }
    webLoad();
}
// parent addeventlistener
// event ka use parent ke andar ke element ka track rakhne ke liye hai
function trackBtn(event) {
    var element = event.target;
    console.log(element);
    var rgb = element.style.backgroundColor;
    console.log(rgb);
    if (pickCorrectColor === rgb) {
        messageDisplay.textContent = "You won!!"
        currentStreak++;
        currentStreakDisplay.textContent = currentStreak;
        webLoad();
        if (bestStreak < currentStreak) {
            // update bestStreak variable, UI and persist it
            bestStreak = currentStreak;
            bestStreakDisplay.textContent = bestStreak;
            localStorage.setItem('highBestStrak', bestStreak);
        }
    }
    else {
        messageDisplay.textContent = `OOPS WRONG ANSWER!! your score is ${currentStreak}`
        currentStreakDisplay.textContent = 0;
        currentStreak = 0;
        // Disable all color boxes
        colorBoxes.forEach(box => {
            box.style.pointerEvents = 'none';
            box.style.opacity = '0.6';
        });
    }
}


function newRoundStart() {
    currentStreak = 0;
    messageDisplay.textContent = " New Round ";
    currentStreakDisplay.textContent = currentStreak;
    webLoad();
}


// game reset
function resetgame() {
    localStorage.removeItem('highBestStrak');
    currentStreak = 0;
    currentStreakDisplay.textContent = currentStreak;
    webLoad();
    messageDisplay.textContent = " Game has been reset. Ready for a fresh start! "
}

//Easy Game Mode
function easy() {
    // switch to easy: use 3 colors and hide/disable the remaining boxes
    num = 3;
    setGame(); //for 3 box
    for (var i = num; i < colorBoxes.length; i++) {
        //  hide extra boxes
        colorBoxes[i].style.display = 'none';
    }
}
// for all 6 
function hard() {
    num = 6;
    setGame();
    for (var i = 0; i < colorBoxes.length; i++) {
        colorBoxes[i].style.pointerEvents = 'auto';
        colorBoxes[i].style.opacity = '1';
        colorBoxes[i].style.display = '';
    }
}

btnTrack.addEventListener('click', trackBtn);
newRoundBtn.addEventListener('click', newRoundStart);
resetStreakBtn.addEventListener('click', resetgame);
easyBtn.addEventListener('click', easy);
hardBtn.addEventListener('click', hard);