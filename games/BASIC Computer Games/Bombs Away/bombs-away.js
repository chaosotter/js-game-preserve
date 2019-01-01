var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Bombs Away';
const VERSION = '1.0.1';

function instructions() {
    T$.println(`
You are a pilot in a World War II Bomber.
`);
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();
  
  let done = false;
  while (!done) {
    let odds = null;
    let side = await T$.inputNumber('What side -- (1) Italy, (2) Allies, (3) Japan, (4) Germany? ', 1, 4);
    switch (side) {
      case 1: // Italy
        switch (await T$.inputNumber('Your target -- (1) Albania, (2) Greece, (3) North Africa? ', 1, 3)) {
          case 1: T$.println(`{B}Should be easy -- you're flying a Nazi-made plane.`);  break;
          case 2: T$.println('{B}Be careful!!!');  break;
          case 3: T$.println(`{B}You're going for the oil, eh?`);  break;
        }
        break;
      case 2: // Allies
        switch (await T$.inputNumber('Aircraft -- (1) Liberator, (2) B-29, (3) B-17, (4) Lancaster? ', 1, 4)) {
          case 1: T$.println(`{B}You've got two tons of bombs flying for Ploesti.`);  break;
          case 2: T$.println(`{B}You're dumping the A-Bomb on Hiroshima.`);  break;
          case 3: T$.println(`{B}You're chasing the Bismarck in the North Sea.`);  break;
          case 4: T$.println(`{B}You're busting a German heavy water plant in the Ruhr.`);  break;
        }
        break;
      case 3: // Japan
        T$.println(`{B}You're flying a Kamikaze mission over the U.S.S. Lexington.`);
        if (await T$.inputYN('Your first Kamikaze mission (y/n)? ')) {
          if (U$.rand(1, 100) > 65) {
            T$.println(`\n{G}Direct hit!!!  ${U$.rand(1, 100)} killed.  Mission successful.`);
          }
        } else {
          T$.println(`{R}Um... why aren't you already dead, then?`);
        }
        odds = 100;
        break;
      case 4: // Germany
        T$.println('A Nazi, eh?  Oh well.');
        switch (await T$.inputNumber(`Are you going for (1) Russia, (2) England, or (3) France? `, 1, 3)) {
          case 1: T$.println(`{B}You're nearing Stalingrad.`);  break;
          case 2: T$.println(`{B}Nearing London.  Be careful, they've got radar.`);  break;
          case 3: T$.println(`{B}Nearing Versailles.  Duck soup.  They're nearly defenseless.`);  break;
        }
        break;
    }
  
    if (odds === null) {
      let miss;
      do {
        miss = await T$.inputNumber('How many missions have you flown? ', 0, Number.MAX_SAFE_INTEGER);
        if (miss >= 160) {
          T$.println('{B}Missions, not miles... 150 missions is high even for old-timers!');
        } else if (miss >= 100) {
          T$.println(`{B}That's pushing the odds!`);
        } else if (miss < 25) {
          T$.println(`{B}Fresh out of training, eh?`);
        }
      } while (miss >= 160);
  
      if (miss > U$.rand(0, 159)) {
        T$.println(`\n{G}Direct hit!!!  ${U$.rand(1, 100)} killed.  Mission successful.`);
      } else {
        T$.println(`\n{R}Missed target by ${U$.rand(2, 32)} miles!`);
        T$.println(`Now you're really in for it!`);
        let defense = await T$.inputNumber(`{W}Does the enemy have (1) guns, (2) missiles, or (3) both? `, 1, 3);
        odds = (defense > 1) ? 35 : 0;
        if (defense != 2) {
          const gun = await T$.inputNumber(`{W}What's the percent hit rate of enemy gunners (10-50)? `, 0, 50);
          if (gun < 10) {
            T$.println(`{R}You lie, but you'll pay...`);
            odds = 100;
          } else {
            odds += gun;
          }
        }
      }
    }
  
    if (odds < U$.rand(1, 100)) {
      T$.println('\n{G}You made it through tremendous flak!!');
    } else {
      T$.println('\n{R}* * * * BOOM * * * *');
      T$.println('{W}You have been shot down...');
      T$.println('Dearly beloved, we are gathered here today to pay our last tribute...');
    }
  
    done = !(await T$.inputYN('Another mission (y/n)? '));
  }

  T$.println('\n{Y}Chicken!!!');
}

main();
