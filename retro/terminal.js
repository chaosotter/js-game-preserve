// Terminal abstraction object for the JS Game Preserve.
//
// This package is meant to allow a game to operate identically as either a
// console application *or* a standard terminal hosted in a Web container.
//
// The Web container functionality does not exist yet, but the API should remain
// static as it emerges.

const readline = require('readline-sync');

/** @type {string} ANSI escape sequence. */
const CSI = '\x1b[';

/** @type {Object.<string, function>} Used to invoke embedded color codes. */
const embeddedCodes = {
  '_': () => term.reset(),
  'k': () => term.fg(module.exports.BLACK),
  'r': () => term.fg(module.exports.DIM_RED),
  'g': () => term.fg(module.exports.DIM_GREEN),
  'y': () => term.fg(module.exports.DIM_YELLOW),
  'b': () => term.fg(module.exports.DIM_BLUE),
  'm': () => term.fg(module.exports.DIM_MAGENTA),
  'c': () => term.fg(module.exports.DIM_CYAN),
  'w': () => term.fg(module.exports.DIM_WHITE),
  'K': () => term.fg(module.exports.GRAY),
  'R': () => term.fg(module.exports.RED),
  'G': () => term.fg(module.exports.GREEN),
  'Y': () => term.fg(module.exports.YELLOW),
  'B': () => term.fg(module.exports.BLUE),
  'M': () => term.fg(module.exports.MAGENTA),
  'C': () => term.fg(module.exports.CYAN),
  'W': () => term.fg(module.exports.WHITE),
  'V': () => module.exports.reverse(),
  'v': () => module.exports.reverseOff(),
};

/**
 * Abstract data type for the terminal.  This version works only in console
 * mode and supports color, cursor control, and line-based input.
 * @type {Object}
 */
const term = {
  /**
   * Sets the foreground color.
   * @param {number} Foreground color to use.
   */
  fg(color) {
    if (color !== module.exports.NONE) {
      if (color >= module.exports.GRAY) {  // bright color
        this.output(`${CSI}3${color - 8};1m`);
      } else {
        this.output(`${CSI}3${color};22m`);
      }
    }
  },
  
  /**
   * Sets the background color.
   * @param {number} Background color to use.
   */
  bg(color) {
    if (color !== module.exports.NONE) {
      this.output(`${CSI}4${color % 8}m`);
    }
  },

  /** Resets foreground and blackground colors. */
  reset() { this.output(`${CSI}0m`) },

  /**
   * Low-level output function.  This processes the input character by
   * character, interpreting embedded color codes such as {W} using the
   * embedded codes map.
   * @param {string} str The string to output.
   */
  output(str) {
    let inCode = false;
    let code = '';

    for (var ch of str) {
      if (inCode) {
        switch (ch) {
          case '{':
            process.stdout.write(ch);
            inCode = false;
            break;
          case '}':
            embeddedCodes[code]();
            [inCode, code] = [false, ''];
            break;
          default:
            code += ch;
        }
      } else if (ch == '{') {
        inCode = true;
      } else {
        process.stdout.write(ch);
      }
    }
  },

  /**
   * Reads a full of line of input, with an optional prompt.
   * @param {string} prompt Prompt for the user.
   * @returns {string} The user input.
   */
  input(prompt = '') {
    this.output(prompt);
    return readline.question('');
  },
};

//------------------------------------------------------------------------------

/** @const */
module.exports = {
  // Externally visible names for the colors.
  BLACK:        0,
  DIM_RED:      1,
  DIM_GREEN:    2,
  DIM_YELLOW:   3,
  DIM_BLUE:     4,
  DIM_MAGENTA:  5,
  DIM_CYAN:     6,
  DIM_WHITE:    7,
  GRAY:         8,
  RED:          9,
  GREEN:       10,
  YELLOW:      11,
  BLUE:        12,
  MAGENTA:     13,
  CYAN:        14,
  WHITE:       15,
  NONE:        16,  // used to avoid changing color

  /**
   * Sets the current foreground color and (optionally) background color.
   * @param {number} fg Foreground color.
   * @param {number=} bg Background color.
   */
  color(fg, bg = this.NONE) {
    term.fg(fg);
    term.bg(bg);
  },

  /** Resets to default colors. */
  reset: () => term.reset(),

  /** Clears the screen.  TODO: Move into term. */
  clear: () => term.output(`${CSI}2J`),

  /** Cursor control.  TODO: Move into term. */
  xy:    (x, y)  => term.output(`${CSI}${y+1};${x+1}H`),
  yx:    (y, x)  => term.output(`${CSI}${y+1};${x+1}H`),
  home:  ()      => term.output(`${CSI}1;1H`),
  up:    (n = 1) => term.output(`${CSI}${n}A`),
  down:  (n = 1) => term.output(`${CSI}${n}B`),
  left:  (n = 1) => term.output(`${CSI}${n}D`),
  right: (n = 1) => term.output(`${CSI}${n}C`),
  
  /** Inverse video.  TODO: Move into term. */
  reverse:    () => term.output(`${CSI}7m`),
  reverseOff: () => term.output(`${CSI}27m`),

  /**
   * Prints a series of strings without a newline.
   * @param {Array.<string>} strs The strings.
   */
  print(...strs) {
    for (var str of strs) {
      term.output(str);
    }
  },
  
  /**
   * Prints a series of strings with a newline.
   * @param {Array.<string>} strs The strings.
   */
  println(...strs) {
    this.print.apply(null, strs);
    term.output('\n');
  },

  /** Stops and asks the user to press enter. */
  delay() {
    this.println('{_}\n[Press Enter to continue.]');
    this.input();
  },

  /**
   * Outputs an appropriate banner at the start of a game.
   * @param {string} source The book or magazine this game is from.
   * @param {string} title The title of the game.
   * @param {string} version The revision number of the game code.
   */
  hello(source, title, version) {
    this.clear();
    this.println(`{W}${title}`);
    this.println(`{G}Inspired by {R}${source}`);
    this.println(`{G}Node.js Version ${version} by {Y}Squunkin{_}`);
  },

  /**
   * Inputs a full line of text, with an optional prompt.
   * @param {string=} prompt The prompt.
   */
  input(prompt = '') {
    return term.input(`{_}${prompt}{Y}`);
  },

  /**
   * Demands that the user enter 'y' or 'n' and converts it to a boolean.
   * @param {string=} prompt The prompt.
   * @returns {boolean}
   */
  inputYN(prompt = '') {
    let value = '';
    while ((value !== 'y') && (value !== 'n')) {
      value = this.input(prompt);
    }
    return (value === 'y');
  },

  /**
   * Demands that the user enter a number in the range [min, max].
   * @param {string} prompt The prompt.
   * @param {number} min The minimum acceptable value.
   * @param {number} max The maximum acceptable value.
   * @returns {number}
   */
  inputNumber(prompt, min, max) {
    let value = min - 1;
    while ((value < min) || (value > max)) {
      value = Number(this.input(prompt));
    }
    return value;
  },
};
