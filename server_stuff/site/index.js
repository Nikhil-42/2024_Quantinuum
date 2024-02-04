import { LEVEL, OBJECT_TYPE } from './setup.js';
import { randomMovement } from './ghostmoves.js';
// Classes
import GameBoard from './GameBoard.js';
import Pacman from './Pacman.js';
import Ghost from './Ghost.js';
// Sounds
/*import soundDot from './sounds/munch.wav';
import soundPill from './sounds/pill.wav';
import soundGameStart from './sounds/game_start.wav';
import soundGameOver from './sounds/death.wav';
import soundGhost from './sounds/eat_ghost.wav';*/
// Dom Elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');
// Game constants
const POWER_PILL_TIME = 10000; // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

// Initial setup
let global_speed = 80; // ms
let score = 0;
let timer = null;
let degrees = 0;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

// --- AUDIO --- //
//function playAudio(audio) {
//  const soundEffect = new Audio(audio);
//  soundEffect.play();
//}

// --- GAME CONTROLLER --- //
function gameOver(pacman, grid) {
  //playAudio(soundGameOver);

  document.removeEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);
  // Show startbutton
  startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts) {
  const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

  if (collidedGhost) {
    if (pacman.powerPill) {
      //playAudio(soundGhost);
      gameBoard.removeObject(collidedGhost.pos, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name
      ]);
      collidedGhost.pos = collidedGhost.startPos;
      score += 100;
    } else {
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.pos, 0);
      gameOver(pacman, gameGrid);
    }
  }
}

function gameLoop(pacman, ghosts) {
  // Rotate world
  // degrees += 1;
  // degrees = degrees % 360;
  // gameGrid.style.transform = 'rotate(' + degrees + 'deg)';
  // 1. Move Pacman
  gameBoard.moveCharacter(pacman);
  // 2. Check Ghost collision on the old positions
  checkCollision(pacman, ghosts);
  // 3. Move ghosts
  ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
  // 4. Do a new ghost collision check on the new positions
  checkCollision(pacman, ghosts);
  // 5. Check if Pacman eats a dot
  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
    //playAudio(soundDot);

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
    // Remove a dot
    gameBoard.dotCount--;
    // Add Score
    score += 10;
  }
  // 6. Check if Pacman eats a power pill
  if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
    //playAudio(soundPill);

    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

    pacman.powerPill = true;
    score += 50;

    clearTimeout(powerPillTimer);
    powerPillTimer = setTimeout(
      () => (pacman.powerPill = false),
      POWER_PILL_TIME
    );
  }
  // 7. Change ghost scare mode depending on powerpill
  if (pacman.powerPill !== powerPillActive) {
    powerPillActive = pacman.powerPill;
    ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
  }
  // 8. Check if all dots have been eaten
  if (gameBoard.dotCount === 0) {
    gameWin = true;
    gameOver(pacman, gameGrid);
  }
  // 9. Show new score
  scoreTable.innerHTML = score;

  // 10. Set timeout for the next game loop
  //setTimeout(() => gameLoop(pacman, ghosts), global_speed);
}

function startGame() {
  //playAudio(soundGameStart);

  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add('hide');

  gameBoard.createGrid(LEVEL);

  const pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
      global_speed = global_speed === 80 ? 640 : 80;
    }
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard));
  });

  const ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
  ];

  // Gameloop
  // setTimeout(() => gameLoop(pacman, ghosts), global_speed);
  setInterval(() => gameLoop(pacman, ghosts), global_speed);
}

// Initialize game
startButton.addEventListener('click', startGame);


// Define the complex matrix
var x = [[{real: -0.75732054, imaginary: -0.2738093}, {real: -0.57956813, imaginary: 0.12487934}],
[{real: 0.51218892, imaginary: 0.29859097}, {real: -0.804903, imaginary: 0.02524081}]];

// Function to draw an arrow representing a complex number at position (x, y) on the canvas
function drawArrow(ctx, x, y, angle, magnitude) {
ctx.beginPath();
ctx.moveTo(x, y);
ctx.lineTo(x + Math.cos(angle) * magnitude, y - Math.sin(angle) * magnitude);
ctx.moveTo(x + Math.cos(angle) * magnitude, y - Math.sin(angle) * magnitude);
ctx.lineTo(x + Math.cos(angle - Math.PI / 10) * (magnitude - 10), y - Math.sin(angle - Math.PI / 10) * (magnitude - 10)); // Adjust arrowhead length
ctx.moveTo(x + Math.cos(angle) * magnitude, y - Math.sin(angle) * magnitude);
ctx.lineTo(x + Math.cos(angle + Math.PI / 8) * (magnitude - 10), y - Math.sin(angle + Math.PI / 10) * (magnitude - 10)); // Adjust arrowhead length
ctx.stroke();
}

// Function to display the complex matrix as arrows on the canvas
function displayComplexMatrix(matrix) {
var canvas = document.getElementById('matrixCanvas');
var ctx = canvas.getContext('2d');

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// Set white color and thicker line for arrows
ctx.strokeStyle = 'white';
ctx.lineWidth = 4; // Set thicker line width
ctx.fillStyle = 'white';

// Draw matrix brackets
ctx.font = '100px Arial';
ctx.fillText('[', 0, 100);
ctx.fillText(']', 170, 100);

// Draw arrows for each complex element in the matrix
for (var i = 0; i < matrix.length; i++) {
for (var j = 0; j < matrix[i].length; j++) {
var complexNumber = matrix[i][j];
var angle = Math.atan2(complexNumber.imaginary, complexNumber.real);
var magnitude = Math.sqrt(complexNumber.real * complexNumber.real + complexNumber.imaginary * complexNumber.imaginary);
drawArrow(ctx, 70 + j * 100, 50 + i * 50, angle, magnitude * 50); // Scale the magnitude
}
}
}

// Call the function to display the complex matrix
displayComplexMatrix(x);
