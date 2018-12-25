var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Batnum';
const VERSION = '1.0.0';

const HUMAN    = 0;
const COMPUTER = 1;

function computerMove(count, minTake, maxTake) {
  const moves = U$.map((x) => [x, (count - x) % (maxTake + 1)],
                       U$.range(minTake, maxTake));
  const okay = U$.filter((x) => x[1] === (lastWin ? 0 : 1), moves);
  if (okay.length > 0) {
    return okay[0][0];
  } else {
    return moves[U$.rand(0, moves.length - 1)][0];
  }
}
    
function instructions() {
  T$.println(`
This game is a generalization of all the games where you take turns taking
objects from a pile -- and it allows you to set the rules!

There's a definite strategy to this class of games, based on modular
arithmetic... and the computer will follow it, so stay on your toes!
`);
}

function other(turn) {
  return (turn + 1) % 2;
}

function printCount(count) {
  if (count === 1) {
    T$.println('{_}\nThere is {G}1{_} item left.');
  } else {
    T$.println(`{_}\nThere are {G}${count}{_} items left.`);
  }
}

//------------------------------------------------------------------------------

T$.hello(SOURCE, TITLE, VERSION);
instructions();

const count   = T$.inputNumber('How many objects in the pile (1-100)? ', 1, 100);
const lastWin = T$.inputYN    ('Win by taking the last object (y/n)? ');

const minTake = T$.inputNumber(`Minimum number to take (1-${count})? `, 1, count);
const maxTake = T$.inputNumber(`Maximum number to take (${minTake}-${count})? `, minTake, count);

let turn = T$.inputYN('Want to go first (y/n)? ') ? COMPUTER : HUMAN;

let done = false;
while (!done) {
  let current = count;
  while (current > 0) {
    turn = other(turn);

    let a = Math.min(current, minTake);
    let b = Math.min(current, maxTake);
    printCount(current);

    if (turn === HUMAN) {
      current -= T$.inputNumber(`How many do you take (${a}-${b})? `, a, b);
    } else {
      const take = computerMove(current, a, b);
      T$.println(`The computer takes {G}${take}{_}.`);
      current -= take;
    }
  }

  if (((turn == HUMAN) && lastWin) || ((turn == COMPUTER) && !lastWin)) {
    T$.println('{G}\nYou won!\n');
  } else {
    T$.println('{R}\nThe computer wins!\n');
  }

  done = !(T$.inputYN(`Play again (y/n)? `));
  T$.println();
}
