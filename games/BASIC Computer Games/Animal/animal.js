var T$ = require('../../../retro/terminal.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Animal Guessing Game';
const VERSION = '1.0.3';

/**
 * Asks the current question, also allowing the user to enter "list" for the
 * current dictionary of animals.
 * @param {string} question The question to ask.
 * @returns {string} Either "y" or "n".
 */
async function askQuestion(question) {
  let answer = '';
  while (answer !== 'y' && answer !== 'n') {
    answer = await T$.input(`${question} `);
    if (answer === 'list') {
      T$.println('{M}');
      listAnimals(root);
      T$.println('{_}');
    } else if (answer.length > 1) {
      answer = answer[0];
    }
  }
  return answer;
}

/** Displays instructions. */
function instructions() {
  T$.print(`
Think of an animal, and the computer will try to guess what animal you're
thinking of.  If it guesses right, hooray for the computer!  If the computer
can't guess it, it will ask you to construct a yes-or-no question to help it
out the next time.

Enter 'list' for any yes-or-no question to get a list of the animals I know.
`);
}

/**
 * Prints out a list of the currently known animals.
 * @param {Object} current The current node of the tree.
 */
function listAnimals(current) {
  if ('a' in current) {
    T$.println(current['a']);
  } else {
    listAnimals(current['y']);
    listAnimals(current['n']);
  }
}

/**
 * Asks the user to construct a new question.
 * @param {Object} old The tree node for the previous animal.
 */
async function newQuestion(old) {
  const newAnimal = await T$.input('What was your animal? ');
  const question = await T$.input(
      `Enter a yes-or-no question that would ` +
      `distinguish a ${old['a']} and a ${newAnimal}:\n`);
  const answer = await askQuestion(`What's the answer for a ${newAnimal}?`);

  old['q'] = question;
  if (answer === 'y') {
    old['y'] = {'a': newAnimal};
    old['n'] = {'a': old['a']};
  } else {
    old['y'] = {'a': old['a']};
    old['n'] = {'a': newAnimal};
  }
  delete old['a'];
}

//------------------------------------------------------------------------------

let root = {'q': 'Does it swim?', 'y': {'a': 'fish'}, 'n': {'a': 'bird'}};

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  while (true) {
    T$.println('{W}Time to think of an animal!');
    T$.println('{_}');
    let current = root;

    while ('q' in current) {
      let answer = await askQuestion(current['q']);
      current = current[answer];
    }

    let answer = await askQuestion(`Is it a ${current['a']}?`);
    if (answer === 'y') {
      T$.println('{G}Huzzah!  My powers of deduction win again!');
    } else {
      T$.println(`{B}Hmmm... I guess I don't know this critter.`);
      await newQuestion(current);
    }
  
    T$.println();
  }
}

main();
