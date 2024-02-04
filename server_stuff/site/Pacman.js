import { OBJECT_TYPE, DIRECTIONS } from './setup.js';


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

      //if(keyCode == 0)
      dir = DIRECTIONS[e.key];

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

export default Pacman;
