var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Awari';
const VERSION = '1.0.1';

const HUMAN    = 0;
const COMPUTER = 1;
const HOME     = [6, 13];

const NOWHERE    = -1;
const VALUE_LOSE = -100;
const VALUE_WIN  = +100;

/**
 * Implements the computer's move.
 * @param {Board} board The current board state.
 * @returns {number} Which move to take.
 */
function computerMove(board) {
  if (board.again) {
    T$.println('{W}Second move!');
  } else {
    T$.println('My move...');
  }
  
  let move = minimax(new Board(board), 7);
  T$.println(`{G}\nI select the pit opposite #${13 - move}`);
  return move;
}

/**
 * Implements the human's move.
 * @param {Board} board The current board state.
 * @returns {number} Which move to take.
 */
function humanMove(board) {
  if (board.again) {
    T$.println('{W}Second move!');
  }
  let move = 0;
  while (!board.isLegal(move - 1)) {
    move = T$.inputNumber('Your move (1-6)? ', 1, 6);
  }
  return move - 1;
}

/** Displays instructions. */        
function instructions() {
  T$.println(`
Awari is a traditional African game played with 36 stones and 14 pits.  Each
player has six pits on their side of the board, plus a special 'home' pit that
represents their score.

On your move, you take all of the stones from one of your pits (other than the
home pit) and distribute them among the other pits, working counter-clockwise
around the board.

If your last stone lands in your home pits, you get a second move.  If it lands
in an empty pit, you capture both that stone and all the stones in the opposite
pit.

Whoever has the most stones in their home when there are no moves remaining
wins.  (Beware, the computer is a tough opponent!)
`);
  T$.delay();
}

/**
 * Uses minimax to search for the computer's next move: this is the max part.
 * @param {Board} board The current board state.
 * @param {number} depth How many moves ahead to search.
 * @returns {Move} The selected best move.
 */
function maxMove(board, depth) {
  // If we're done searching or the game is over, use the current state.
  if (depth == 0 || board.gameOver()) {
    return new Move(board.last, board.eval());
  }

  // If there's no move, switch sides and try again.
  if (!board.hasMove()) {
    board.turn = other(board.turn);
    board.again = false;
    return minMove(board, depth);
  }

  // Start with a sentinel move.
  let best = new Move(NOWHERE, VALUE_LOSE - 1);

  // For each potential move:
  for (let offset = 1; offset <= 6; offset++) {
    // Make sure it's a legal move.
    const location = HOME[board.turn] - offset;
    if (board.pits[location] == 0) {
      continue;
    }

    // Calculate its effect on the game state.
    const next = new Board(board, location);

    // And evaluate that state.
    let move;
    if (next.again) {
      move = maxMove(next, depth - 1);
    } else {
      move = minMove(next, depth - 1);
    }
    if (move.value > best.value) {
      best = new Move(location, move.value);
    }
  }

  return best;
}

/**
 * Uses minimax to search for the computer's next move: this is the min part.
 * @param {Board} board The current board state.
 * @param {number} depth How many moves ahead to search.
 * @returns {Move} The selected worst move.
 */
function minMove(board, depth) {
  // If we're done searching or the game is over, use the current state.
  if (depth == 0 || board.gameOver()) {
    return new Move(board.last, board.eval());
  }

  // If there's no move, switch sides and try again.
  if (!board.hasMove()) {
    board.turn = other(board.turn);
    board.again = false;
    return maxMove(board, depth);
  }

  // Start with a sentinel move.
  let worst = new Move(NOWHERE, VALUE_WIN + 1);

  // For each potential move:
  for (let offset = 1; offset <= 6; offset++) {
    // Make sure it's a legal move.
    const location = HOME[board.turn] - offset;
    if (board.pits[location] == 0) {
      continue;
    }

    // Calculate its effect on the game state.
    const next = new Board(board, location);

    // And evaluate that state.
    let move;
    if (next.again) {
      move = minMove(next, depth - 1);
    } else {
      move = maxMove(next, depth - 1);
    }
    if (move.value < worst.value) {
      worst = new Move(location, move.value);
    }
  }

  return worst;
}

/**
 * Uses minimax to search for the computer's next move.
 * @param {Board} board The current board state.
 * @param {number} depth How many moves ahead to search.
 * @returns {number} The selected best move.
 */
function minimax(board, depth) {
  return maxMove(board, depth).location;
}

/**
 * Given a turn (human or computer), return the other turn.
 * @param {number} turn This turn.
 * @returns {number} The other turn.
 */
function other(turn) {
  return (turn + 1) % 2;
}

//------------------------------------------------------------------------------

class Move {
  constructor(location, value) {
    this.location = location;
    this.value = value;
  }
}

//------------------------------------------------------------------------------

class Board {
  constructor(...previous) {
    switch (previous.length) {
      case 0:  // new game
        this.pits  = [3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 0];
        this.turn  = HUMAN;
        this.last  = -1;
        this.again = false;
        break;
      case 1:  // make copy of board
        this.pits  = previous[0].pits.slice();
        this.turn  = previous[0].turn;
        this.last  = previous[0].last;
        this.again = previous[0].again;
        break;
      default:  // new move
        this.pits  = previous[0].pits.slice();
        this.turn  = previous[0].turn;
        this.again = previous[0].again;
        this.apply(previous[1]);
        this.last  = previous[1];
    }
  }

  apply(move) {
    // Distribute the stones.
    let current = move;
    while (this.pits[move] > 0) {
      current = (current + 1) % 14;
      this.pits[move]    -= 1;
      this.pits[current] += 1;
    }

    // Handle capture.
    if (current != HOME[HUMAN] && current != HOME[COMPUTER] && this.pits[current] == 1) {
      this.pits[HOME[this.turn]] += 1 + this.pits[12 - current];
      this.pits[current] = this.pits[12 - current] = 0;
    }

    // Handle second moves.
    if (current == HOME[this.turn] && this.hasMove() && !this.again) {
      this.again = true;
    } else {
      this.again = false;
      this.turn  = other(this.turn);
    }
  }

  display() {
    const fmt = [];
    for (let i = 0; i < 14; i++) {
      fmt.push(U$.pad(this.pits[i], 2));
    }

    T$.println();
    T$.println(`{B}      ${fmt[12]}  ${fmt[11]}  ${fmt[10]}  ${fmt[9]}  ${fmt[8]}  ${fmt[7]}`);
    T$.println(`  {V}${fmt[13]}{_}                          {R}{V}${fmt[6]}{_}`);
    T$.println(`{R}      ${fmt[0]}  ${fmt[1]}  ${fmt[2]}  ${fmt[3]}  ${fmt[4]}  ${fmt[5]}`);
    T$.println('{_}      {V}#1{v}  {V}#2{v}  {V}#3{v}  {V}#4{v}  {V}#5{v}  {V}#6{v}\n');
  }

  eval() {
    if (this.gameOver()) {
      if (this.pits[HOME[COMPUTER]] < this.pits[HOME[HUMAN]]) {
        return VALUE_LOSE;
      } else if (this.pits[HOME[COMPUTER]] > this.pits[HOME[HUMAN]]) {
        return VALUE_WIN;
      }
    }
    return (this.pits[HOME[COMPUTER]] - this.pits[HOME[HUMAN]]);
  }

  gameOver() {
    return (this.pits[HOME[HUMAN]] + this.pits[HOME[COMPUTER]]) >= 36;
  }

  hasMove() {
    for (let i = 1; i <= 6; i++) {
      if (this.pits[HOME[this.turn] - i] > 0) {
        return true;
      }
    }
    return false;
  }

  isLegal(move) {
    if (move < 0)                           return false;
    if (move == HOME[HUMAN])                return false;
    if (move >= 13)                         return false;
    if (this.pits[move] == 0)               return false;
    if (this.turn == HUMAN    && move > 5)  return false;
    if (this.turn == COMPUTER && move < 7)  return false;
    return true;
  }
}

//------------------------------------------------------------------------------

T$.hello(SOURCE, TITLE, VERSION);
instructions();

let done = false;
while (!done) {
  let board = new Board();
    
  while (!board.gameOver()) {
    if (board.hasMove()) {
      board.display();
      board.apply((board.turn == HUMAN) ? humanMove(board) : computerMove(board));
    } else {
      board.turn = other(board.turn);
    }
  }

  board.display();
  T$.println('{W}\nGAME OVER!');
  if (board.pits[HOME[HUMAN]] > board.pits[HOME[COMPUTER]]) {
    T$.println('You win!  (By pure luck...)\n');
  } else if (board.pits[HOME[HUMAN]] < board.pits[HOME[COMPUTER]]) {
    T$.println(`I win!  (You're only human...)\n`);
  } else {
    T$.println('Huh, a tie...\n');
  }

  done = !(T$.inputYN('Another game (y/n)? '));
}
