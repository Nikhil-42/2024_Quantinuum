import { OBJECT_TYPE, DIRECTIONS } from './setup.js';

let QMSTATEVECTOR = [math.matrix([math.complex(1,0),
  math.complex(0,0)])];
let BLOCHSPHERE = gen_bloch_sphere();
let STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length - 1]));
init_plotting(BLOCHSPHERE.concat(STATEARROW).concat([]));

let current_matrix = null;
let current_eigenvector = null;

class Pacman {
  constructor(speed, startPos) {
    this.pos = startPos;
    this.speed = speed;
    this.dir = null;
    this.timer = 0;
    this.powerPill = false;
    this.rotation = true;
  }

  shouldMove() {
    // Don't move before a key is pressed
    if (!this.dir) return;

    if (this.timer === this.speed) {
      this.timer = 0;
      return true;
    }
    this.timer++;
  }

  getNextMove(objectExist) {
    let nextMovePos = this.pos + this.dir.movement;
    // Do we collide with a wall?
    if (
      objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
      objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)
    ) {
      nextMovePos = this.pos;
    }

    return { nextMovePos, direction: this.dir };
  }

  makeMove() {
    const classesToRemove = [OBJECT_TYPE.PACMAN];
    const classesToAdd = [OBJECT_TYPE.PACMAN];

    return { classesToRemove, classesToAdd };
  }

  setNewPos(nextMovePos) {
    this.pos = nextMovePos;
  }

  handleKeyInput = (e, objectExist) => {
    let dir;

    if (e.keyCode >= 48 && e.keyCode <= 51) {
      let key = e.keyCode-48
      console.log(key)
      fetch("http://localhost:8000/generate_matrix").then(response => response.json()).then((r)=>{
        displayComplexMatrix(r);
        console.log(r);
        // ui.js

        let QMSTATEVECTOR = [math.matrix([math.complex(r.eigenvector_real[0],r.eigenvector_imag[0]),
          math.complex(r.eigenvector_real[1],r.eigenvector_imag[1])])];
        let BLOCHSPHERE = gen_bloch_sphere();
        let STATEARROW = gen_vector_plot(state2vector(QMSTATEVECTOR[QMSTATEVECTOR.length - 1]));
        init_plotting(BLOCHSPHERE.concat(STATEARROW).concat([]));
      })

      // eigenvalue_real r.eigenvalue_imag => phase of eigenvalue
      phase = math.atan2(r.eigenvalue_imag, r.eigenvalue_real) * 180 / math.PI;
      phase += 90 * key;
      phase %= 360;
      // dir = phase * i^key 
      console.log(phase);
      // console.log
      // Map to key code
      if ( phase >= 315 || phase < 45) {
        direction = 'ArrowRight';
      } else if (phase >= 45 && phase < 135) {
        direction = 'ArrowUp';
      } else if (phase >= 135 && phase < 225) {
        direction = 'ArrowLeft';
      } else if (phase >= 225 && phase < 315) {
        direction = 'ArrowDown';
      }

      //if(keyCode == 0)
      dir = DIRECTIONS[direction];

      //fetch new matrix and vector
      //set new matrix and vector graphics
      //store them in a global variable here for the next keypress
    } else {
      return;
    }

    const nextMovePos = this.pos + dir.movement;
    if (objectExist(nextMovePos, OBJECT_TYPE.WALL)) return;
    this.dir = dir;
  };
}


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
  for (var i = 0; i < matrix['real_part'].length; i++) {
    for (var j = 0; j < matrix['real_part'][i].length; j++) {
      var complexNumber = {'real': matrix['real_part'][i][j], 'imaginary': matrix['imag_part'][i][j]};
      var angle = Math.atan2(complexNumber.imaginary, complexNumber.real);
      var magnitude = Math.sqrt(complexNumber.real * complexNumber.real + complexNumber.imaginary * complexNumber.imaginary);
      drawArrow(ctx, 70 + j * 100, 50 + i * 50, angle, magnitude * 50); // Scale the magnitude
    }
  }
}


export default Pacman;
