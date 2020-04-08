var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Bug';
const VERSION = '1.0.0';

const BODY = 0;
const NECK = 1;
const HEAD = 2;
const FEELERS = 3;
const TAIL = 4;
const LEGS = 5;

function instructions() {
  T$.println(`
The Game Bug.  I hope you enjoy this game.

The object of Bug is to finish your bug before I finish mine.  Each number
stands for a part of the bug body.  I will roll the die for you, tell you what
I rolled for you, what the number stands for, and if you can get the part.
If you can get the part, I will give it to you.  The same will happen on my
turn.

If there is a change in either bug, I will give you the option of seeing the
pictures of the bugs.  The numbers stand for parts as follows:

  Number   Part      Number of parts needed
  1        Body      1
  2        Neck      1
  3        Head      1
  4        Feelers   2
  5        Tail      1
  6        Legs      6
`);
}

class Player {
  constructor(human) {
    this.name = human ? '{G}You' : '{R}I';
    this.pos = human ? '{G}Your' : '{R}My';
    this.left = [1, 1, 1, 2, 1, 6];
  }
  
  roll() {
    const roll = U$.rand(1, 6);
    T$.println(`${this.name} rolled a ${roll}.`);
    return [this.body, this.neck, this.head, this.feelers, this.tail, this.legs][roll - 1].apply(this);
  }
  
  done() {
    return U$.sum(this.left) === 0;
  }
  
  body() {
    T$.println('{C}1 = Body');
    if (this.left[BODY] === 0) {
      T$.println(`${this.name} do not need a body.`);
      return false;
    } else {      
      T$.println(`${this.name} now have a body.`);
      this.left[BODY] = 0;
      return true;
    }
  }
  
  neck() {
    T$.println('{C}2 = Neck');
    if (this.left[NECK] === 0) {
      T$.println(`${this.name} do not need a neck.`);
      return false;
    } else if (this.left[BODY] > 0) {
      T$.println(`${this.name} do not have a body.`);
      return false;
    } else {
      T$.println(`${this.name} now have a neck.`);
      this.left[NECK] = 0;
      return true;
    }
  }
  
  head() {
    T$.println('{C}3 = Head');
    if (this.left[HEAD] === 0) {
      T$.println(`${this.name} have a head.`);
      return false;
    } else if (this.left[NECK] > 0) {
      T$.println(`${this.name} do not have a neck.`);
      return false;
    } else {
      T$.println(`${this.name} needed a head.`);
      this.left[HEAD] = 0;
      return true;
    }
  }
  
  feelers() {
    T$.println('{C}4 = Feelers');
    if (this.left[FEELERS] === 0) {
      T$.println(`${this.name} have two feelers already.`);
      return false;
    } else if (this.left[HEAD] > 0) {
      T$.println(`${this.name} do not have a head.`);
      return false;
    } else {
      T$.println(`${this.name} receive a feeler.`);
      this.left[FEELERS]--;
      return true;
    }
  }
  
  tail() {
    T$.println('{C}5 = Tail');
    if (this.left[TAIL] === 0) {
      T$.println(`${this.name} already have a tail.`);
      return false;
    } else if (this.left[BODY] > 0) {
      T$.println(`${this.name} do not have a body.`);
      return false;
    } else {
      T$.println(`${this.name} now have a tail.`);
      this.left[TAIL] = 0;
      return true;
    }
  }
  
  legs() {
    T$.println('{C}6 = Legs');
    if (this.left[LEGS] === 0) {
      T$.println(`${this.name} have six feet already.`);
      return false;
    } else if (this.left[BODY] > 0) {
      T$.println(`${this.name} do not have a body.`);
      return false;
    } else {
      this.left[LEGS]--;
      T$.println(`${this.name} now have ${6 - this.left[LEGS]} leg(s).`);
      return true;
    }
  }
  
  draw() {
    T$.println(`{_}****** ${this.pos} Bug {_}******`);
    T$.println(`{B}`);
    this.drawFeelers();
    this.drawHead();
    this.drawNeck();
    this.drawBody();
    this.drawLegs();
    T$.println(`{_}`);
  }
  
  drawFeelers() {
    if (this.left[FEELERS] >= 2) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      T$.print(`         `);
      for (let j = 0; j < 2 - this.left[FEELERS]; j++) {
        T$.print(` A`);
      }
      T$.println();
    }
  }
  
  drawHead() {
    if (this.left[HEAD] > 0) {
      return;
    }
    T$.println(`        HHHHHHH`);
    T$.println(`        H     H`);
    T$.println(`        H O O H`);
    T$.println(`        H     H`);
    T$.println(`        H  V  H`);
    T$.println(`        HHHHHHH`);
  }
  
  drawNeck() {
    if (this.left[NECK] > 0) {
      return;
    }
    T$.println(`          N N`);
    T$.println(`          N N`);
  }
  
  drawBody() {
    if (this.left[BODY] > 0) {
      return;
    }
    T$.println(`     BBBBBBBBBBBBB`);
    T$.println(`     B           B`);
    T$.println(`     B           B`);
    if (this.left[TAIL] == 0) {
      T$.println(`TTTTTB           B`);
    }    
    T$.println(`     BBBBBBBBBBBBB`);
  }
  
  drawLegs() {
    if (this.left[LEGS] >= 6) {
      return;
    }
    for (let i = 0; i < 2; i++) {
      T$.print(`     `);
      for (let j = 0; j < (6 - this.left[LEGS]); j++) {
        T$.print(` L`);
      }
      T$.println();
    }
  }
}

async function maybePictures(player, computer) {
  T$.println();
  if (await T$.inputYN('Do you want the pictures (y/n)? ')) {
    T$.println();
    player.draw();
    computer.draw();
  }
}

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();
  
  let player = new Player(true);
  let computer = new Player(false);
  
  while (!player.done() && !computer.done()) {
    await T$.delay();
    if (player.roll()) {
      await maybePictures(player, computer);
    }
    await T$.delay();
    if (computer.roll()) {
      await maybePictures(player, computer);
    }
  }
  
  if (player.done()) {
    T$.println(`{G}Your bug is finished.`);
  }
  if (computer.done()) {
    T$.println(`{R}My bug is finished.`);
  }
  
  await maybePictures(player, computer);
  T$.println(`{_}`);
  T$.println(`I hope you enjoyed the game -- play it again soon!`);
}

main();
