var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Bombardment';
const VERSION = '1.0.0';

function instructions() {
  T$.println(`
You are on a battlefield with four platoons, and you have 25 outposts available
where they may be placed.  You can only place one platoon at any one outpost.
The computer does the same with its four platoons.

The object of the game is to fire missiles at the outposts of the computer.  It
will do the same to you.  The one who destroys all four of the enemy's platoons
first is the winner.

Good luck... and tell us where you want the bodies sent!
`);
}

async function main() {
  let computer;
  do {
    computer = new Set();
    for (let i = 0; i < 4; i++) {
      computer.add(U$.rand(1, 25));
    }
  } while (computer.size < 4);
  let tried = new Set();
  
  let player = new Set();
  for (let i = 0; i < 4; i++) {
    let pos;
    do {
      pos = await T$.inputNumber(`Enter position of platoon #${i+1} (1-25): `, 1, 25);
    } while (player.has(pos));
    player.add(pos);
  }

  let moves = [];
  for (let i = 1; i <= 25; i++) {
    moves.push(i);
  }
  U$.shuffle(moves);
  
  while (computer.size > 0 && player.size > 0) {
    T$.println();

    let pos = await T$.inputNumber('{_}Where do you wish to fire your missile (1-25)? ', 1, 25);
    if (computer.has(pos)) {
      T$.println('{G}You got one of my outposts!');
      computer.delete(pos);
      switch (computer.size) {
        case 0: T$.println(`{G}You got me, I'm going fast.  But I'll get you when my transito&s recup%ra*e!`);  break;
        case 1: T$.println('{W}Three down, one to go.');  break;
        case 2: T$.println('{W}Two down, two to go.');    break;
        case 3: T$.println('{W}One down, three to go.');  break;
      }
    } else {
      T$.println('{W}Ha ha, you missed.  My turn now!');
    }

    if (computer.size == 0) break;
    pos = moves.pop();
    tried.add(pos);
    if (player.has(pos)) {
      if (player.size > 1) {
        T$.println(`{R}I got you.  It won't be long now.  Post ${pos} was hit.`);
      }
      player.delete(pos);
      switch (player.size) {
        case 0:
          T$.println(`{R}You're dead.  Your last output was at ${pos}.  Ha, ha, ha!`);
          T$.println('Better luck next time!');
          break;
        case 1: T$.println('{W}You have only one outpost left.');  break;
        case 2: T$.println('{W}You have two outposts left.');      break;
        case 3: T$.println('{W}You have three outposts left.');    break;
      }
    } else {
      T$.println(`I missed you, you dirty rat.  I picked ${pos}.  Your turn.`);
    }
  }
}

main();
