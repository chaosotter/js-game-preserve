var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Boxing';
const VERSION = '1.0.0';

//------------------------------------------------------------------------------

class Player {
  constructor(name, good, weak) {
    this.name = name;
    this.good = good;  // the advantage punch
    this.weak = weak;  // the disadvantage punch
    this.points = 0;
    this.damage = 0;
    this.ko = false;
  }
}

//------------------------------------------------------------------------------

let player, opponent;

function instructions() {
  T$.println(`
Boxing Olympic-style (3 rounds -- 2 out of 3 wins)
`);
}

async function buildPlayers() {
  const oname = await T$.input(`What is your opponent's name? `);
  const pname = await T$.input(`Input your man's name: `);
  T$.println('\n{_}Different punches are: (1) full swing; (2) hook; (3) uppercut; (4) jab.');
  const pgood = await T$.inputNumber(`What is your man's best? `, 1, 4);
  const pweak = await T$.inputNumber('What is his vulnerability? ', 1, 4);
  
  const ogood = U$.rand(1, 4);
  let oweak;
  do {
    oweak = U$.rand(1, 4);
  } while (ogood === oweak);

  player = new Player(pname, pgood, pweak);
  opponent = new Player(oname, ogood, oweak);
  T$.println(`\n{B}${opponent.name}'s advantage is ${opponent.good} and his vulnerability is secret.`);
}

function checkKO() {
  if (player.ko) {
    T$.println(`{R}${player.name} is knocked cold and ${opponent.name} is the winner and champ!`);
    return true;
  } else if (opponent.ko) {
    T$.println(`{G}${opponent.name} is knocked cold and ${player.name} is the winner and champ!`);
    return true;
  }
  return false;
}

function checkVictory() {
  if (player.points >= 2) {
    T$.println(`{G}${player.name} wins (nice going, ${player.name}).`);
    return true;
  } else if (opponent.points >= 2) {
    T$.println(`{R}${opponent.name} amazingly wins!!`);
    return true;
  }
  return false;
}

const OPPONENT_DISPATCH = {1: opponentFullSwing, 2: opponentHook, 3: opponentUppercut, 4: opponentJab};

function opponentSwing() {
  const punch = U$.rand(1, 4);
  if (punch === opponent.good) {
    player.damage += 2;
  }
  OPPONENT_DISPATCH[punch]();
}

function opponentFullSwing() {
  T$.print(`{R}${opponent.name} takes a full swing and `);
  if (player.weak === 1 || U$.rand(1, 60) < 30) {
    T$.println('Pow!!!  He hits him right in the face!');
    if (player.damage > 35) {
      player.ko = true;
    }
    player.damage += 15;
  } else {
    T$.println(`it's blocked!`);
  }
}

function opponentHook() {
  T$.println(`{R}${opponent.name} gets ${player.name} in the jaw!  (Ouch!)`);
  T$.println('...And again!');
  player.damage += 12;
  if (player.damage > 35) {
    player.ko = true;
  }
}

function opponentUppercut() {
  T$.println(`{R}${player.name} is attacked by an uppercut (oh, oh)...`);
  if (player.weak === 3 || U$.rand(1, 200) <= 75) {
    T$.println(`And ${opponent.name} connects...`);
    player.damage += 8;
  } else {
    T$.println(`{G}${player.name} blocks and hits ${opponent.name} with a hook.`);
    opponent.damage += 5;
  }
}

function opponentJab() {
  T$.print(`{R}${opponent.name} jabs and `);
  if (player.weak === 4 || U$.rand(1, 7) > 4) {
    T$.println('blood spills!!!');
    player.damage += 5;
  } else {
    T$.println(`it's blocked!`);
  }
}

const PLAYER_DISPATCH = {1: playerFullSwing, 2: playerHook, 3: playerUppercut, 4: playerJab};

async function playerSwing() {
  const punch = await T$.inputNumber(`${player.name}'s punch (1-4)? `, 1, 4);
  if (punch === player.good) {
    opponent.damage += 2;
  }
  PLAYER_DISPATCH[punch]();
}

function playerFullSwing() {
  T$.print(`{G}${player.name} swings and `);
  if (opponent.weak === 1 || U$.rand(1, 30) < 10) {
    T$.println('he connects!');
    if (opponent.damage > 35) {
      opponent.ko = true;
    }
    opponent.damage += 15;
  } else {
    T$.println('he misses.');
  }
}

function playerHook() {
  T$.print(`{G}${player.name} gives the hook... `);
  if (opponent.weak === 2 || U$.rand(1, 2) === 1) {
    T$.println('and connects!');
    opponent.damage += 7;
  } else {
    T$.println(`but it's blocked!!!`);
  }
}

function playerUppercut() {
  T$.print(`{G}${player.name} tries an uppercut `);
  if (opponent.weak === 3 || U$.rand(1, 2) === 1) {
    T$.println('and he connects!');
    opponent.damage += 4;
  } else {
    T$.println(`and it's blocked!  (Lucky block!)`);
  }
}

function playerJab() {
  T$.println(`{G}${player.name} jabs at ${opponent.name}'s head!`);
  if (opponent.weak === 4 || U$.rand(1, 8) >= 4) {
    opponent.damage += 3;
  } else {
    T$.println(`It's blocked.`);
  }
}

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  await buildPlayers();  
  for (let round = 1; round <= 4; round++) {
    if (checkVictory()) break;  // guaranteed to trigger by round 4
    
    player.damage = opponent.damage = 0;
    T$.println(`\n{C}Round ${round} begins...{_}`);
    
    let ko = false;
    for (let swing = 0; swing < 7; swing++) {
      await (U$.rand(1, 2) === 1 ? playerSwing : opponentSwing)();
      if (checkKO()) {
        ko = true;
        break;
      }
    }
    if (ko) break;

    if (player.damage < opponent.damage) {
      T$.println(`{G}${player.name} wins round ${round}!`);
      player.points++;
    } else {
      T$.println(`{R}${opponent.name} wins round ${round}!`);
      opponent.points++;
    }
  }

  T$.println('\n{W}And now goodbye from the Olympic Arena.');
}

main();
