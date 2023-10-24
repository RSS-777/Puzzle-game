const counerInfo = document.querySelector('.counter-info>span');
const timeInfo = document.querySelector('.time-info>span');
const helpInfo = document.querySelector('.help-info>span');
const bestInfo = document.querySelector('.best-info>span');
const startGame = document.querySelector('.start-button>button');
const stopGame = document.querySelector('.stop-button>button')
const helpGame = document.querySelector('.help-button>button');
const resetGame = document.querySelector('.reset-button>button');
const ruleFone = document.querySelector('.rule-fone');
const winGame = document.querySelector('.win-game');
const winGameText = document.querySelector('.win-game>p')
const loseGame = document.querySelector('.lose-game>p');
const ruleInfo = document.querySelector('.rule-info>p');
const audioFone = document.querySelector('.audio-fone');
const audioWin = document.querySelector('.audio-win');
const audioLose = document.querySelector('.audio-lose');
helpGame.parentNode.classList.add('off-button')
resetGame.parentNode.classList.add('off-button')
resetGame.disabled = true;
const puzzleContainer = document.getElementById('puzzle-container');

startGame.onclick = () => {
    shuffleTiles()
    createTiles();
    startGame.style.display = 'none';
    stopGame.style.display = 'block';
    ruleFone.style.display = 'none';
    ruleInfo.style.display = 'none';
    loseGame.style.display = 'none';
    audioWin.pause();
    audioFone.load();
    audioFone.play();
    flagTime = true;
    timeCountdownFunc();
    helpInfo.innerText = 3;
    helpGame.parentNode.classList.remove('off-button');
    resetGame.parentNode.classList.remove('off-button');
    resetGame.disabled = false;
    counerInfo.innerText = currentCout;
    winGame.style.display = 'none';
    winGameText.style.display = 'none'
    incrementCounter('off')
};

stopGame.onclick = stopGameFunc;
function stopGameFunc() {
    startGame.style.display = 'block';
    stopGame.style.display = 'none';
    audioFone.pause();
    audioLose.play();
    ruleFone.style.display = 'block';
    loseGame.style.display = 'block';
    flagTime = false;
    helpInfo.innerText = 0;
    helpGame.parentNode.classList.add('off-button')
    resetGame.parentNode.classList.add('off-button')
    resetGame.disabled = true;
    incrementCounter('off')
    shuffleTiles()
};

resetGame.onclick = () => {
    audioFone.load();
    audioFone.play();
    timeCountdownFunc();
    helpInfo.innerText = 3;
    helpGame.parentNode.classList.remove('off-button');
    shuffleTiles();
    createTiles();
    incrementCounter('off')
};

helpGame.onclick = () => {
    if (helpInfo.innerText > 0) {
        claerPieces()
        helpInfo.innerText = helpInfo.innerText - 1
    }
    if (helpInfo.innerText < 1) {
        helpGame.parentNode.classList.add('off-button')
    }
};

let flagTime = false;
let timerId;
function timeCountdownFunc() {
    let timer = 900;
    if (timerId) clearTimeout(timerId)
    function timeCount() {
        if (timer > 0 && flagTime === true) {
            timer--;
            timeInfo.innerText = timer;
            timerId = setTimeout(() => { timeCount() }, 1000)
        } else {
            timer = 0;
            timeInfo.innerText = 0;
            stopGameFunc()
        }
    }
    if (flagTime) timeCount()
};

let currentCout = 0;
function incrementCounter(status = 'on') {
    if (status === 'on') {
        currentCout += 1;
        counerInfo.innerText = currentCout;
    } else {
        currentCout = 0;
        counerInfo.innerText = null;
    }
};

const gridSize = 5;
const tileCount = 25;
const tiles = [];
for (let i = 1; i <= tileCount; i++) {
    tiles.push(i)
};

tiles[tiles.length - 1] = null;

function shuffleTiles() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
};

function createTiles() {
    puzzleContainer.innerHTML = '';
    for (let i = 0; i < tileCount; i++) {
        const tile = document.createElement('div');
        tile.className = `tile piece${tiles[i]}`;
        tile.setAttribute('data-index', i);
        tile.addEventListener('click', moveTile);
        puzzleContainer.append(tile);
        if (tiles[i] === null) {
            tile.classList.add('empty');
        }
    }
};

function claerPieces() {
    winGame.style.display = 'block'
    setTimeout(() => { winGame.style.display = 'none' }, 3000)
};

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) {
            return false;
        }
    }
    return true;
};

function moveTile(event) {
    const currentIndex = parseInt(event.target.getAttribute('data-index'));
    const emptyIndex = tiles.indexOf(null);

    if (currentIndex === emptyIndex - 1 || currentIndex === emptyIndex + 1 ||
        currentIndex === emptyIndex - gridSize || currentIndex === emptyIndex + gridSize) {
        [tiles[currentIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[currentIndex]];
        createTiles();

        if (checkWin()) {
            winGame.style.display = 'block';
            winGameText.style.display = 'block'
            helpGame.parentNode.classList.add('off-button')
            resetGame.parentNode.classList.add('off-button')
            resetGame.disabled = true;
            helpGame.disabled = true;
            stopGame.style.display = 'none';
            startGame.style.display = 'block';
            clearTimeout(timerId)
            audioFone.pause();
            audioWin.play();
            function bestResult() {
                const count = Number(counerInfo.innerText);
                const best = Number(bestInfo.innerText);
                if (best > count || best === 0) {
                    bestInfo.innerText = count + 1;
                }
            }
            bestResult()
        }
        incrementCounter()
    }
};