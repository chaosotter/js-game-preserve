var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Bagels';
const VERSION = '1.0.1';

/**
 * Checks for the "bagels" condition.
 * @param {string} number The secret number.
 * @param {string} guess The player's guess.
 */
function checkBagels(number, guess) {
  if (number.indexOf(guess[0]) == -1 &&
      number.indexOf(guess[1]) == -1 &&
      number.indexOf(guess[2]) == -1) {
    T$.println('{R}BAGELS{_}');
  }
}

/**
 * Checks for the "fermi" condition.
 * @param {string} number The secret number.
 * @param {string} guess The player's guess.
 */
function checkFermi(number, guess) {
  for (let i = 0; i < 3; i++) {
    if (guess[i] == number[i]) {
      T$.println('{G}FERMI{_}');
    }
  }
}

/**
 * Checks for the "pico" condition.
 * @param {string} number The secret number.
 * @param {string} guess The player's guess.
 */
function checkPico(number, guess) {
  for (let i = 0; i < 3; i++) {
    if (guess[i] == number[(i+1) % 3] || guess[i] == number[(i+2) % 3]) {
      T$.println('{Y}PICO{_}');
    }
  }
}

/**
 * Evaluates the player's guess.
 * @param {string} number The secret number.
 * @param {string} guess The player's guess.
 */
function evaluate(number, guess) {
  T$.println();
  checkPico  (number, guess);
  checkFermi (number, guess);
  checkBagels(number, guess);
  T$.println();
}

/** Displays instructions. */
function instructions() {
  T$.println(`
I will think of a number with three digits, all different.  Try to guess it!
I'll give you some clue after each guess:

PICO means that a digit is correct, but in the wrong place.
FERMI means that a digit is correct and in the right place.
BAGELS means that you're entirely wrong!
`);
}

/**
 * Picks the secret number.
 * @returns {string} The number.
 */
function pickNumber() {
  let a = U$.rand(1, 9);
  let b = U$.rand(0, 9);
  let c = U$.rand(0, 9);
  while (a == b || a == c || b == c) {
    b = U$.rand(0, 9);
    c = U$.rand(0, 9);
  }
  return `${a}${b}${c}`;
}

/**
 * Checks to see if this is a valid guess.
 * @param {string} guess The user's guess.
 * @returns {boolean} True if valid.
 */
function validGuess(guess) {
  const result = (guess[0] != guess[1] &&
                  guess[0] != guess[2] &&
                  guess[1] != guess[2]);
  if (!result) {
    T$.println('{R}\nAs I said, all three digits are different...\n');
  }
  return result;
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  const prompt = `{W}What's your guess? `;

  let done = false;
  while (!done) {
    let number   = pickNumber();
    let guessNum = 0;
    let guess    = 0;

    while (guess != number) {
      guessNum++;
      T$.println(`{C}This is guess #${guessNum}`);

      do {
        guess = String(await T$.inputNumber(prompt, 100, 999));
      } while (!validGuess(guess));

      if (number != guess) {
        evaluate(number, guess);
      }
    }

    T$.println(`{M}\nYES!  You got it in ${guessNum} guesses!\n`);
    done = !(await T$.inputYN('Another round (y/n)? '));
    T$.println();
  }
}

main();
