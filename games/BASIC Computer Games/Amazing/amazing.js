var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Amazing Maze Generator';
const VERSION = '1.0.3';

const WALL  = 0;
const SPACE = 1;
const CRUMB = 2;

const UP    = 0;
const DOWN  = 1;
const LEFT  = 2;
const RIGHT = 3;

const DIR   = [ [-1, 0], [1, 0], [0, -1], [0, 1] ];

let maze = [];
let rows = 0;
let cols = 0;

/** Fills the entire (rows x cols) maze with walls. */
function allocateMaze() {
  maze = []
  for (let row = 0; row < rows; row++) {
    maze.push([]);
    for (let col = 0; col < cols; col++) {
      maze[row].push(WALL);
    }
  }
}

/**
 * Returns true if we can dig in direction |dir| from the given location.
 * @param {number} row The row number.
 * @param {number} col The column number.
 * @param {number} dir The direction.
 * @returns {boolean}
 */
function canDig(row, col, dir) {
  row += 2 * DIR[dir][0]
  col += 2 * DIR[dir][1]
  return (row > 0 && row < rows && col > 0 && col < cols && maze[row][col] === WALL);
}

/**
 * Modifies the maze by digging in direction |dir| from the given location.
 * @param {number} row The row number.
 * @param {number} col The column number.
 * @param {number} dir The direction.
 */
function dig(row, col, dir) {
  maze[row                ][col                ] = SPACE;
  maze[row +   DIR[dir][0]][col +   DIR[dir][1]] = CRUMB;
  maze[row + 2*DIR[dir][0]][col + 2*DIR[dir][1]] = SPACE;
}

/** Actually generates the maze. */
function generateMaze() {
  let row = 1;
  let col = 1;
  let done = false;

  while (!done) {
    let okay = [];
    for (let dir = 0; dir < 4; dir++) {
      if (canDig(row, col, dir)) {
        okay.push(dir);
      }
    }

    if (okay.length > 0) {
      const dir = okay[U$.rand(0, okay.length - 1)];
      dig(row, col, dir);
      row += 2 * DIR[dir][0];
      col += 2 * DIR[dir][1];
    } else if (row === 1 && col === 1) {
      done = true;
    } else {
      for (let dir = 0; dir < 4; dir++) {
        if (maze[row + DIR[dir][0]][col + DIR[dir][1]] === CRUMB) {
          maze[row + DIR[dir][0]][col + DIR[dir][1]] = SPACE;
          row += 2 * DIR[dir][0];
          col += 2 * DIR[dir][1];
          break;
        }
      }
    }

    maze[0       ][1       ] = SPACE;
    maze[rows - 1][cols - 2] = SPACE;
  }
}

/**
 * Gets one dimension of the maze size.
 * @param {string} msg Which dimension to input.
 * @param {number} min The minimum acceptable size.
 * @param {number} max The maximum acceptable size.
 */
async function getSize(msg, min, max) {
  const prompt = `Enter ${msg} (${min}-${max}): `;
  return await T$.inputNumber(prompt, min, max);
}

/** Displays instructions. */
function instructions() {
  T$.println(`
The computer will generate a maze of the complexity you specify.  There will be
only one path through the maze, and an infinite variety of mazes can be
generated.
`);
}

/** Prints out the constructed maze. */
function printMaze() {
  T$.clear();
  T$.print('{W}');
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (maze[row][col] == WALL) {
        T$.print('{V} {v}');
      } else {
        T$.print(' ');
      }
    }
    T$.println();
  }
  T$.println('{_}');
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  cols = await getSize('width',  1, 39) * 2 + 1;
  rows = await getSize('height', 1, 39) * 2 + 1;

  allocateMaze();
  generateMaze();
  printMaze();
}

main();
