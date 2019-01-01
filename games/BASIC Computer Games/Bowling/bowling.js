var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Bowling';
const VERSION = '1.0.0';

/**
 * These constants control the logic that determines the result of a single
 * roll.  They have no counterpart in the original BASIC code, which was pretty
 * much just random crap that accidentally sort of worked.  The game still has
 * no element of skill, but this should provide some ideas.
 * 
 * Array ordering:
 *
 *   9 8 7 6
 *    5 4 3
 *     2 1
 *      0
 */
const STRIKE = 0.2;
const GUTTER = 0.2;
const PINS = [0.94, 0.91, 0.91, 0.85, 0.88, 0.85, 0.80, 0.84, 0.84, 0.80];

function instructions() {
  T$.println(`
{_}The game of bowling takes mind and skill.  During the game the computer will
keep score.  You may compete with other players (up to four).  You will be
playing ten frames.

On the pin diagram 'O' means the pin is down, and '+' means the pin is
standing.  After the game, the computer will show your scores.
`);
}

//------------------------------------------------------------------------------

class Pins {
  constructor() {
    this.pins = [true, true, true, true, true, true, true, true, true, true];
  }
  
  async bowl(frame, ball) {
    await T$.input(`Type 'roll' to get the ball rolling: `);
    T$.println(`\n{C}Frame: ${frame}  Ball: ${ball}`);

    let next = new Pins();
    next.pins = this.pins.slice();

    if (Math.random() <= STRIKE) {
      for (let i = 0; i < this.pins.length; i++) {
        next.pins[i] = false;
      }
    } else if (Math.random() > GUTTER) {
      for (let i = 0; i < this.pins.length; i++) {
        next.pins[i] = next.pins[i] && (Math.random() > PINS[i]);
      }
    }

    next.print();
    return [next, this.up() - next.up()];
  }
  
  print() {
    let k = 9;
    for (let i = 0; i < 4; i++) {
      T$.tab(i+1);
      for (let j = 0; j < 4-i; j++) {
        T$.print(this.pins[k--] ? '{W}+{_} ' : '{r}O{_} ');
      }
      T$.println();
    }
  }
  
  up() {
    return U$.reduce((acc, x) => { return acc + (x ? 1 : 0) }, 0, this.pins);
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.frames = [];
  }
  
  async playFrame() {
    this.frames.push([]);
    let pins = new Pins();
    let score = 0;

    let bonus = false;
    T$.println(`\n{W}${this.name}, this is frame ${this.frames.length}.`);
    [pins, score] = await pins.bowl(this.frames.length, 1);
    this.frames[this.frames.length-1].push(score);
    if (score === 10) {
      T$.println('\n{G}STRIKE!!!');
      if (this.frames.length === 10) {
        pins = new Pins();
        bonus = true;
      } else return;
    } else if (score === 0) {
      T$.println('\n{R}Gutter ball!');
    }

    T$.println('\n{W}Second ball.');
    [pins, score] = await pins.bowl(this.frames.length, 2);
    this.frames[this.frames.length-1].push(score);
    if (score === 10) {
      T$.println('\n{G}STRIKE!!!');
      if (this.frames.length === 10) {
        pins = new Pins();
      }
    } else if (pins.up() === 0) {
      T$.println('\n{G}Spare!');
      if (this.frames.length === 10) {
        pins = new Pins();
        bonus = true;
      }
    } else if (score === 0) {
      T$.println('\n{R}Gutter ball!');
    }

    if (bonus) {
      T$.println('\n{W}Third ball.');
      [pins, score] = await pins.bowl(this.frames.length, 3);
      this.frames[this.frames.length-1].push(score);
      if (score === 10) {
        T$.println('\n{G}STRIKE!!!');
      } else if (pins.up() === 0) {
        T$.println('\n{G}Spare!');
      } else if (score === 0) {
        T$.println('\n{R}Gutter ball!');
      }
    }
  }
  
  score() {
    T$.println(`\n{C}${this.name} Score:`);
    
    T$.print('{R}');
    for (let i = 0; i < this.frames.length; i++) {
      T$.print(U$.rjustify(`${i+1}`, 6));
    }
    T$.println();

    for (let i = 0; i < this.frames.length; i++) {
      const f = this.frames[i];
      T$.print('{W}');
      
      // Special handling for bonus balls in the tenth frame.
      if (i === 9) {
        if (f[0] === 10) {
          switch (f.length) {
            case 2:
              T$.print('   X');
              T$.print(' ', f[1] === 0 ? '-' : `${f[1]}`);
              break;
            case 3:
              T$.print(' X');
              T$.print(' ', f[1] === 10 ? 'X' : (f[1] === 0 ? '-' : `${f[1]}`));
              T$.print(' ', f[1]+f[2] === 10 ? '/' : (f[2] === 10 ? 'X' : (f[2] === 0 ? '-' : `${f[2]}`)));
              break;
          }
          continue;
        } else if (f[0]+f[1] === 10) {
          T$.print(' ', f[0] === 0 ? '-' : `${f[0]}`, ' /');
          T$.print(' ', f[2] === 10 ? 'X' : (f[2] === 0 ? '-' : `${f[2]}`));
          continue;
        }
      }

      if (this.frames[i][0] === 10) {
        T$.print('     X');
      } else {
        T$.print('   ', f[0] === 0 ? '-' : `${f[0]}`);
        T$.print(' ', f[0]+f[1] === 10 ? '/' : (f[1] === 0 ? '-' : `${f[1]}`));
      }
    }
    T$.println();
    
    let score = 0;
    T$.print('{G}');
    for (let i = 0; i < this.frames.length; i++) {
      let f = this.frames[i].slice();
      if (i+2 < this.frames.length) {
        f.push(...this.frames[i+1]);
        f.push(...this.frames[i+2]);
      } if (i+1 < this.frames.length) {
        f.push(...this.frames[i+1]);
      }
      f.push(...[0, 0]);  // for incomplete games
      if (f[0] === 10 || f[0]+f[1] === 10) {
        score += f[0] + f[1] + f[2];
      } else {
        score += f[0] + f[1];
      }
      T$.print(U$.rjustify(`${score}`, 6));
    }
    T$.println();
  }
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  T$.println('\nWelcome to the alley!');
  T$.println('Bring your friends.');
  T$.println(`\nOkay, let's first get acquainted.`);
  if (await T$.inputYN('Do you want instructions (y/n)? ')) {
    instructions();
  }
  
  let done = false;
  while (!done) {
    T$.println();
    let num = await T$.inputNumber('\nFirst of all, how many are playing (1-4)? ', 1, 4);
    let players = [];
    for (let i = 0; i < num; i++) {
      players.push(new Player(`Player ${i+1}`));
    }
    T$.println('Very good...');
    
    for (let frame = 0; frame < 10; frame++) {
      for (let player of players) {
        await player.playFrame();
        player.score();
      }
    }
    
    T$.println(`\n{W}Game over!  Final scores:`);
    for (let player of players) {
      player.score();
    }
    T$.println();

    done = !(await T$.inputYN('Do you want another game (y/n)? '));
  }
}

main();
