var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Bounce';
const VERSION = '1.0.0';

function instructions() {
  T$.println(`
This simulation lets you specify the initial velocity of a ball thrown straight
up, and the coefficient of elasticity of the ball.  Please use a decimal
fraction for the coefficient (less than 1).

You also specify the time increment to be used in 'strobing' the ball's flight
(try 0.1 initially).
`);
}

//------------------------------------------------------------------------------

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  while (true) {
    const inc = await T$.inputNumber('Time increment (sec)? ', 0, 10);
    const v0 = await T$.inputNumber('Velocity (ft/sec)? ', 0, 100);
    const c = await T$.inputNumber('Coefficient? ', 0, 1);
  
    let t = [];
    let s1 = Math.floor(70 / (v0 / (16 * inc)));
    for (let i = 0; i < s1; i++) {
      t.push(v0 * c**i / 16);
    }

    let l;
    T$.println('\n{W}Feet\n');
    for (let h = Math.floor(-16 * (v0/32)**2 + v0**2 / 32 + 0.5); h >= 0; h -= 0.5) {
      if (Math.abs(h - Math.floor(h)) < 0.1) {
        T$.print(`${h}`);
      }
      l = 0;
      for (let i = 0; i < s1; i++) {
        for (let tm = 0; tm <= t[i]; tm += inc) {
          l += inc;
          if (Math.abs(h - (0.5 * -32 * tm**2 + v0 * c**i * tm)) <= 0.25) {
            T$.tab(Math.round(l / inc));
            T$.print('{G}0{_}');
          }
        }
        let tm = t[s1] / 2;
        if (-16 * tm**2 + v0 * c**s1 * tm < h) break;
      }
      T$.println();
    }

    T$.print('{W}');
    for (let i = 1; i <= Math.floor(l+1) / inc + 1; i++) {
      T$.print('.');
    }
    T$.println();
    
    T$.print('0');
    for (let i = 1; i <= Math.floor(l+0.9995); i++) {
      T$.tab(Math.floor(i / inc));
      T$.print(`${i}`);
    }
    T$.println();
    
    T$.tab(Math.floor(l+1) / (2 * inc) - 2);
    T$.println('seconds');
    T$.println();
  }
}

main();
