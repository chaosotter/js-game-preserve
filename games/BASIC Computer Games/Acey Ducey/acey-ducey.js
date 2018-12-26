var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Acey Ducey';
const VERSION = '1.0.4';

/**
 * Translates a card in the range [0, 51] to a user-readable string.
 * @param {number} card The card value.
 * @returns {string}
 */
function cardString(card) {
  let color = Math.floor((card / 13) < 2) ? '{R}' : '{W}';
  return (
      color +
      ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][card % 13] +
      ['♠', '♥', '♦', '♣'][Math.floor(card / 13)] +
      '{_}');
}

/** Displays instructions. */
function instructions() {
  T$.println(`
The computer deals two cards face up.  Place your bet according to whether you
think the next card will be between the first two.

The dealer wins on a tie, aces are high, and you keep playing until you're
either bored or broke.
`);
}

/**
 * Selects the low card, the high card, and the drawn card.
 * @returns {Array.<number>}
 */
function pickCards() {
  let a = U$.rand(0, 51);
  let b = U$.rand(0, 51);
  let c = U$.rand(0, 51);
  while ((a === b) || (a === c) || (b === c)) {
    b = U$.rand(0, 51);
    c = U$.rand(0, 51);
  }
  if (value(a) > value(b)) {
    [a, b] = [b, a];
  }
  return [a, b, c];
}

/**
 * Returns the numeric value of the card (aces high).
 * @param {number} card Card number in the range [0, 51].
 */
function value(card) {
  return card % 13;
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  let cash = 100;
  while (cash > 0) {
    let [a, b, c] = pickCards();

    T$.println(`You now have {G}$${cash}{_}.`);
    T$.println(`Here are your cards:  ${cardString(a)}  ${cardString(b)}`);

    let bet = await T$.inputNumber('How much do you bet? ', 0, cash);

    if (bet === 0) {
      T$.println(`{Y}Chicken!`);
    } else {
      T$.println(`\n{_}The next card is: ${cardString(c)}`);
      if (value(a) < value(c) && value(c) < value(b)) {
        T$.println(`{G}You win!`);
        cash += bet;
      } else {
        T$.println(`{R}Sorry, you lose.`);
        cash -= bet;
      }
    }
  
    T$.println(`{_}`);
  }

  T$.println(`{W}You're broke -- get outta here!{_}`);
}

main();
