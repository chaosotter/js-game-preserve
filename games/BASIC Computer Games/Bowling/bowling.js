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

/**
 * 10 PRINT TAB(34); "BOWL"
20 PRINT TAB(15); "CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY"
30 PRINT: PRINT: PRINT
270 DIM C(15), A(100, 6)
360 PRINT "WELCOME TO THE ALLEY"
450 PRINT "BRING YOUR FRIENDS"
540 PRINT "OKAY LET'S FIRST GET ACQUAINTED"
630 PRINT ""
720 PRINT "THE INSTRUCTIONS (Y/N)"
810 INPUT Z$
900 IF Z$ = "Y" THEN 990
960 IF Z$ = "N" THEN 1530
990 PRINT "THE GAME OF BOWLING TAKES MIND AND SKILL.DURING THE GAME"
1080 PRINT "THE COMPUTER WILL KEEP SCORE.YOU MAY COMPETE WITH"
1170 PRINT "OTHER PLAYERS[UP TO FOUR].YOU WILL BE PLAYING TEN FRAMES"
1260 PRINT "ON THE PIN DIAGRAM 'O' MEANS THE PIN IS DOWN...'+' MEANS THE"
1350 PRINT "PIN IS STANDING.AFTER THE GAME THE COMPUTER WILL SHOW YOUR"
1440 PRINT "SCORES ."
1530 PRINT "FIRST OF ALL...HOW MANY ARE PLAYING";
1620 INPUT R
1710 PRINT
1800 PRINT "VERY GOOD..."
1890 FOR I = 1 TO 100: FOR J = 1 TO 6: A(I, J) = 0: NEXT J: NEXT I
1980 F = 1
2070 FOR P = 1 TO R
    2160 M = 0
    2250 B = 1
    2340 M = 0: Q = 0
    2430 FOR I = 1 TO 15: C(I) = 0: NEXT I
    2520 REM ARK BALL GENERATOR USING MOD '15' SYSTEM
    2610 PRINT "TYPE ROLL TO GET THE BALL GOING."
    2700 INPUT N$
    2790 K = 0: D = 0
    2880 FOR I = 1 TO 20
        2970 X = INT(RND(1) * 100)
        3060 FOR J = 1 TO 10
            3150 IF X < 15 * J THEN 3330
        3240 NEXT J
        3330 C(15 * J - X) = 1
    3420 NEXT I
    3510 REM ARK PIN DIAGRAM
    3600 PRINT "PLAYER:"; P; "FRAME:"; F; "BALL:"; B
    3690 FOR I = 0 TO 3
        3780 PRINT SPACE$(I);
        3870 FOR J = 1 TO 4 - I
            3960 K = K + 1
            4050 IF C(K) = 1 THEN 4320
            4140 PRINT "+ ";
            4230 GOTO 4410
            4320 PRINT "O ";
        4410 NEXT J
        4420 PRINT
    4500 NEXT I
    4590 PRINT ""
    4680 REM ARK ROLL ANALYSIS
    4770 FOR I = 1 TO 10
        4860 D = D + C(I)
    4950 NEXT I
    5040 IF D - M <> 0 THEN 5220
    5130 PRINT "GUTTER!!"
    5220 IF B <> 1 OR D <> 10 THEN 5490
    5310 PRINT "STRIKE!!!!!!"
    5400 Q = 3
    5490 IF B <> 2 OR D <> 10 THEN 5760
    5580 PRINT "SPARE!!!!"
    5670 Q = 2
    5760 IF B <> 2 OR D >= 10 THEN 6030
    5850 PRINT "ERROR!!!"
    5940 Q = 1
    6030 IF B <> 1 OR D >= 10 THEN 6210
    6120 PRINT "ROLL YOUR 2ND BALL"
    6210 REM ARK STORAGE OF THE SCORES
    6300 PRINT
    6390 A(F * P, B) = D
    6480 IF B = 2 THEN 7020
    6570 B = 2
    6660 M = D
    6750 IF Q = 3 THEN 6210
    6840 A(F * P, B) = D - M
    6930 IF Q = 0 THEN 2520
    7020 A(F * P, 3) = Q
7110 NEXT P
7200 F = F + 1
7290 IF F < 11 THEN 2070
7295 PRINT "FRAMES"
7380 FOR I = 1 TO 10
    7470 PRINT I;
7560 NEXT I
7650 PRINT
7740 FOR P = 1 TO R
    7830 FOR I = 1 TO 3
        7920 FOR J = 1 TO 10
            8010 PRINT A(J * P, I);
        8100 NEXT J
        8105 PRINT
    8190 NEXT I
    8280 PRINT
8370 NEXT P
*/