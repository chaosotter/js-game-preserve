var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Battle';
const VERSION = '1.0.1';

const SIZE   = 6;
const SHIPS  = [2, 2, 3, 3, 4, 4];

const OFFSET = [[1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,1], [1,1]];

function instructions() {
  T$.println(`
This is an educational variant on the popular board game 'Battleship'.  The
computer will place six ships in a six-by-six matrix:

  Ships 1 and 2: Destroyers (two spaces long)
  Ships 3 and 4: Cruisers (three spaces long)
  Ships 5 and 6: Aircraft carriers (four spaces long)"

Your job is to sink the ships by entering the coordinates of the location where
you want to drop a bomb.  The computer will let you know whether you scored a
hit or not, and on which ship.

Try to get the best splash-to-hit ratio you can!
`);
}

//------------------------------------------------------------------------------

class Board {
  constructor(size) {
    this.size  = size;
        
    this.board = [];
    for (let row = 0; row < size; row++) {
      this.board.push([]);
      for (let col = 0; col < size; col++) {
        this.board[row].push(0);
      }
    }

    this.left = [];
    for (let ship = 0; ship < SHIPS.length; ship++) {
      this.placeShip(ship + 1, SHIPS[ship]);
      this.left.push(SHIPS[ship]);
    }
  }

  bomb(row, col) {
    let ship = 0;
    if (this.board[row][col] !== 0) {
      ship = this.board[row][col];
      this.left[ship - 1]--;
    }
    this.board[row][col] = 0;
    return ship;
  }

  done() {
    return U$.sum(this.left) === 0;
  }

  pickLocation() {
    return [U$.rand(0, this.size-1), U$.rand(0, this.size-1), U$.rand(0, 7)];
  }

  placementOkay(shipSize, row, col, dir) {
    for (let i = 0; i < shipSize; i++) {
      if (row < 0 || row >= this.size ||
          col < 0 || col >= this.size || this.board[row][col] != 0) {
        return false;
      }
      row += OFFSET[dir][1];
      col += OFFSET[dir][0];
    }
    return true;
  }

  placeShip(ship, shipSize) {
    let row, col, dir;
    do {
      [row, col, dir] = this.pickLocation();
    } while (!this.placementOkay(shipSize, row, col, dir));
    for (let i = 0; i < shipSize; i++) {
      this.board[row][col] = ship;
      row += OFFSET[dir][1];
      col += OFFSET[dir][0];
    }
  }

  printBoard() {
    T$.println(`\n\nThis coded map of the computer's fleet layout was intercepted,`);
    T$.println(`but our code experts haven't been able to figure it out!\n`);
    for (let row of this.board) {
      T$.print('{W}');
      for (let col of row) {
        T$.print(` ${col}`);
      }
      T$.println('{_}');
    }
  }

  printLosses() {
    T$.print(`So far, I've lost `);
    let losses = [];

    if (this.sunk(1) || this.sunk(2)) {
      losses.push((this.sunk(1) && this.sunk(2)) ? 'two destroyers' : 'a destroyer');
    }
    if (this.sunk(3) || this.sunk(4)) {
      losses.push((this.sunk(3) && this.sunk(4)) ? 'two cruisers' : 'a cruiser');
    }
    if (this.sunk(5) || this.sunk(6)) {
      losses.push((this.sunk(5) && this.sunk(6)) ? 'two aircraft carriers' : 'an aircraft carrier');
    }

    switch (losses.length) {
      case 3:
        T$.println(`${losses[0]}, ${losses[1]}, and ${losses[2]}.`);
        break;
      case 2:
        T$.println(`${losses[0]} and ${losses[1]}.`);
        break;
      default:
        T$.println(`${losses[0]}.`);
    }
  }

  sunk(ship) {
    return this.left[ship - 1] === 0;
  }
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  let board = new Board(SIZE);

  if (await T$.inputYN('Show coded map (good for younger players)? ')) {
    board.printBoard();
  }
  T$.println();

  let hit  = 0;
  let miss = 0;

  while (!board.done()) {
    let row = await T$.inputNumber(`Enter row to bomb (1-${SIZE}): `, 1, SIZE) - 1;
    let col = await T$.inputNumber(`Enter column to bomb (1-${SIZE}): `, 1, SIZE) - 1;

    let ship = board.bomb(row, col);
    if (ship === 0) {
      T$.println('{R}Splash!  Try again.');
      miss++;
    } else {
      T$.println(`{G}A direct hit on ship #${ship}!`);
      hit++;
      if (board.sunk(ship)) {
        T$.println('{W}And you sank it!  Hurrah for the good guys!');
        board.printLosses();
      }
    }

    T$.print('{_}\nYour current splash-to-hit ratio is {C}');
    if (hit === 0) {
      T$.println(`0{_}`);
    } else {
      T$.println(`${miss / hit}{_}`);
    }
  }

  T$.println(`{W}\nVICTORY!  You have wiped out the computer's fleet!`);
  T$.println('{_}');
}

main();
