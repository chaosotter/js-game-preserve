var T$ = require('../../../retro/terminal.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Banner';
const VERSION = '1.0.0';

const CHAR_X = 7;
const CHAR_Y = 9;
const SPACE  = '                                        ';

const BITMAP = {
  ' ': [   1,   1,   1,   1,   1,   1,   1 ],
  'A': [ 505,  37,  35,  34,  35,  37, 505 ],
  'G': [ 125, 131, 258, 258, 290, 163, 101 ],
  'E': [ 512, 274, 274, 274, 274, 258, 258 ],
  'T': [   2,   2,   2, 512,   2,   2,   2 ],
  'W': [ 256, 257, 129,  65, 129, 257, 256 ],
  'L': [ 512, 257, 257, 257, 257, 257, 257 ],
  'S': [  69, 139, 274, 274, 274, 163,  69 ],
  'O': [ 125, 131, 258, 258, 258, 131, 125 ],
  'N': [ 512,   7,   9,  17,  33, 193, 512 ],
  'F': [ 512,  18,  18,  18,  18,   2,   2 ],
  'K': [ 512,  17,  17,  41,  69, 131, 258 ],
  'B': [ 512, 274, 274, 274, 274, 274, 239 ],
  'D': [ 512, 258, 258, 258, 258, 131, 125 ],
  'H': [ 512,  17,  17,  17,  17,  17, 512 ],
  'M': [ 512,   7,  13,  25,  13,   7, 512 ],
  '?': [   5,   3,   2, 354,  18,  11,   5 ],
  'U': [ 128, 129, 257, 257, 257, 129, 128 ],
  'R': [ 512,  18,  18,  50,  82, 146, 271 ],
  'P': [ 512,  18,  18,  18,  18,  18,  15 ],
  'Q': [ 125, 131, 258, 258, 322, 131, 381 ],
  'Y': [   8,   9,  17, 481,  17,   9,   8 ],
  'V': [  64,  65, 129, 257, 129,  65,  64 ],
  'X': [ 388,  69,  41,  17,  41,  69, 388 ],
  'Z': [ 386, 322, 290, 274, 266, 262, 260 ],
  'I': [ 258, 258, 258, 512, 258, 258, 258 ],
  'C': [ 125, 131, 258, 258, 258, 131,  69 ],
  'J': [  65, 129, 257, 257, 257, 129, 128 ],
  '1': [   1,   1, 261, 259, 512, 257, 257 ],
  '2': [ 261, 387, 322, 290, 274, 267, 261 ],
  '*': [  69,  41,  17, 512,  17,  41,  69 ],
  '3': [  66, 130, 258, 274, 266, 150, 100 ],
  '4': [  33,  49,  41,  37,  35, 512,  33 ],
  '5': [ 160, 274, 274, 274, 274, 274, 226 ],
  '6': [ 193, 289, 305, 297, 293, 291, 194 ],
  '7': [ 258, 130,  66,  34,  18,  10,   8 ],
  '8': [  69, 171, 274, 274, 274, 171,  69 ],
  '9': [ 263, 138,  74,  42,  26,  10,   7 ],
  '=': [  41,  41,  41,  41,  41,  41,  41 ],
  '!': [   1,   1,   1, 384,   1,   1,   1 ],
  '0': [  57,  69, 131, 258, 131,  69,  57 ],
  '.': [   1,   1, 129, 449, 129,   1,   1 ],
};

function instructions() {
  T$.println(`
Enter a message, and I will output it to the screen in large block letters.
For extra fun, save the output to a file and print it out.  (Or don't, and save
a tree!)
`);
}

function getCharacter() {
  const prompt = 'Enter character to use (leave blank for current character): ';
  let char = T$.input(prompt);
  if (char.length > 1) {
    char = char[0];
  }
  return char;
}

function getScale(msg, min, max) {
  const prompt = `Enter ${msg} scale (${min}-${max}): `;
  return T$.inputNumber(prompt, min, max);
}

function drawCharacter(ch) {
  const tab  = findTab();
  const draw = findChar(ch);

  for (let row = 0; row < CHAR_Y; row++) {
    for (let y = 0; y < scaleY; y++) {
      T$.print(SPACE.slice(0, tab));
      for (let col = 0; col < CHAR_X; col++) {
        for (let x = 0; x < scaleX; x++) {
          T$.print((((BITMAP[ch][col] - 1) & (1 << row)) != 0) ? draw : ' ');
        }
      }
      T$.println();
    }
  }
  for (let row = 0; row < scaleY; row++) {
    T$.println();
  }
}

function findChar(ch) {
  return (char == '') ? ch : char;
}

function findTab() {
  return centered ? Math.floor((80 - (CHAR_X * scaleX)) / 2) : 0;
}

//------------------------------------------------------------------------------

T$.hello(SOURCE, TITLE, VERSION);
instructions();

let scaleX   = getScale('horizontal', 1, 11);
let scaleY   = getScale('vertical',   1, 11);
let centered = T$.inputYN('Center output (y/n)? ');
let char     = getCharacter();
let message  = T$.input('Enter message: ').toUpperCase();

T$.println('{W}');
for (let ch of message) {
  drawCharacter(ch);
}
