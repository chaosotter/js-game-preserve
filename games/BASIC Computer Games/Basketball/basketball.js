var T$ = require('../../../retro/terminal.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Basketball';
const VERSION = '1.0.0';

const HOME = 0;
const AWAY = 1;

const PLAY_30    = 1;
const PLAY_15    = 2;
const PLAY_LAYUP = 3;
const PLAY_SET   = 4;

const DEFENSE_PRESS      = 1;
const DEFENSE_MAN_TO_MAN = 2;
const DEFENSE_ZONE       = 3;
const DEFENSE_NONE       = 4;

function addPoints(which, howMany) {
  score[which] += howMany;
  printScore();
}

function awayJump() {
  T$.println('{W}Jump shot!');
  if ((Math.random() * 16.0 / (defense + 11)) <= 0.35) {
    T$.println('{B}Shot is good.');
    addPoints(AWAY, 2);
    return HOME;
  } else {
    return awayJumpMiss();
  }
}

function awayJumpFoul() {
  if ((Math.random() * 16.0 / (defense + 11)) <= 0.90) {
    T$.println('Player fouled.  Two shots.');
    doFoul(AWAY);
  } else {
    T$.println(`{R}Offensive foul.  IU's ball.`);
  }
  return HOME;
}

function awayJumpMiss() {
  if ((Math.random() * 16.0 / (defense + 11)) <= 0.75) {
    T$.println('Shot is off rim.');
    return awayJumpRebound();
  } else {
    return awayJumpFoul();
  }
}

function awayJumpRebound() {
  if ((Math.random() * (defense + 11) / 12.0) <= 0.50) {
    T$.println('{R}IU controls the rebound.');
    return HOME;
  } else {
    T$.println(`{B}${opponent} controls the rebound.{W}`);
    return awayJumpSteal();
  }
}

function awayJumpSteal() {
  if (defense == DEFENSE_PRESS && Math.random() > 0.75) {
    T$.println('{R}Ball stolen.  Easy lay-up for IU!');
    addPoints(HOME, 2);
    return AWAY;
  } else if (Math.random() <= 0.50) {
    T$.println(`Pass back to ${opponent} guard.`);
    return AWAY;
  } else {
    return awayLayup(PLAY_LAYUP);
  }
}

function awayLayup(play) {
  T$.println((play > PLAY_LAYUP) ? '{W}Set shot!' : '{W}Lay-up!');
  if ((Math.random() * 14.0 / (defense + 11)) <= 0.413) {
    T$.println('{B}Shot is good.');
    addPoints(AWAY, 2);
    return HOME;
  } else {
    return awayLayupMiss();
  }
}

function awayLayupMiss() {
  T$.println('Shot missed.');
  return awayJumpRebound();
}

function checkHalftime(time) {
  if (time === 50) {
    T$.println('{W}\n*** END OF FIRST HALF ***');
    printScore();
    throw 'halftime';
  }
  return time;
}

function checkOvertime(time) {
  if (time >= 100 && score[HOME] === score[AWAY]) {
    T$.println('{W}\n*** END OF SECOND HALF ***');
    printScore();
    T$.println('{W}Two-minute overtime!\n');
    time = 93;
  }
  return time;
}

function checkWarning(time) {
  if (time === 92) {
    T$.println('{W}\nTwo minutes left in the game!\n');
  }
  return time;
}

function doFoul(which) {
  if (Math.random() <= 0.49) {
    T$.println('Shooter makes both shots.');
    addPoints(which, 2);
  } else if (Math.random() <= 0.75) {
    T$.println('Shooter makes one shot and misses one.');
    addPoints(which, 1);
  } else {
    T$.println('Both shots missed.');
    printScore();
  }
}

function getDefense() {
  T$.println('{W}\nSelect a defense:');
  T$.println('{Y}  (1) {_}Press');
  T$.println('{Y}  (2) {_}Man-to-Man');
  T$.println('{Y}  (3) {_}Zone');
  T$.println('{Y}  (4) {_}None');
  T$.println();
  return T$.inputNumber('Your choice? ', 1, 4);
}

function getPlay() {
  T$.println('{W}\nSelect a play:');
  T$.println(`{Y}  (1) {_}Long Jump Shot (30')`);
  T$.println(`{Y}  (2) {_}Short Jump Shot (15')`);
  T$.println('{Y}  (3) {_}Lay Up');
  T$.println('{Y}  (4) {_}Set Shot');
  T$.println('{Y}  (0) {_}Change Defense');
  T$.println();
  const result = T$.inputNumber('Your choice? ', 0, 4);
  if (result === 0) {
    defense = getDefense();
    return getPlay();
  }
  T$.println();
  return result;
}

function getOpponent() {
  T$.println();
  return T$.input('And who will be your opponent today? ');
}

function homeJump() {
  tick();
  T$.println('{W}Jump shot!');
  if (Math.random() <= (0.341 * (defense + 11) / 16.0)) {
    T$.println('{R}Shot is good!');
    addPoints(HOME, 2);
    return AWAY;
  } else {
    return homeJumpMiss();
  }
}

function homeJumpBlock() {
  if (Math.random() <= (0.782 * (defense + 11) / 16.0)) {
    T$.println('Shot is blocked!');
    if (Math.random() <= 0.50) {
      T$.println(`{B}Ball controlled by ${opponent}.`);
      return AWAY;
    } else {
      T$.println(`{R}Ball controlled by IU.`);
      return HOME;
    }
  } else {
    return homeJumpFoul()
  }
}

function homeJumpFoul() {
  if (Math.random() <= (0.843 * (defense + 11) / 16.0)) {
    T$.println('Shooter is fouled.  Two shots.');
    doFoul(HOME);
  } else {
    T$.println('Charging foul.  IU loses the ball.');
  }
  return AWAY;
}

function homeJumpMiss() {
  if (Math.random() <= (0.682 * (defense + 11) / 16.0)) {
    T$.println('{W}Shot is off-target.');
    return homeJumpRebound();
  } else {
    return homeJumpBlock();
  }
}

function homeJumpRebound() {
  if (((defense + 11) / 12.0 * Math.random()) <= 0.45) {
    T$.println(`{B}Rebound to ${opponent}...`);
    return AWAY;
  } else {
    T$.println('{R}IU controls the rebound!{W}');
    if (Math.random() <= 0.40) {
      return homeLayup(PLAY_LAYUP);
    } else {
      return homeJumpSteal();
    }
  }
}

function homeJumpSteal() {
  if (defense == DEFENSE_PRESS && Math.random() > 0.6) {
    T$.println(`{B}Pass stolen by ${opponent} -- easy lay-up!`);
    addPoints(AWAY, 2);
  } else {
    T$.println('Ball passed back to you.');
  }
  return HOME;
}

function homeLayup(play) {
  tick();
  T$.println((play == PLAY_SET) ? '{W}Set shot!' : '{W}Lay-up!');
  if ((Math.random() * 14.0 / (defense + 11)) <= 0.40) {
    T$.println('{R}Shot is good!  Two points.');
    addPoints(HOME, 2);
    return AWAY;
  } else {
    return homeLayupMiss();
  }
}

function homeLayupBlock() {
  if ((Math.random() * 14.0 / (defense + 11)) <= 0.925) {
    T$.println(`{B}Shot blocked.  ${opponent}'s ball.`);
  } else {
    T$.println('{B}Charging foul.  IU loses the ball.');
  }
  return AWAY
}

function homeLayupFoul() {
  if ((Math.random() * 14.0 / (defense + 11)) <= 0.875) {
    T$.println('Shooter fouled.  Two shots.');
    doFoul(HOME);
    return AWAY;
  } else {
    return homeLayupBlock();
  }
}

function homeLayupMiss() {
  if ((Math.random() * 14.0 / (defense + 11)) <= 0.70) {
    T$.println('Shot is off the rim.');
    return homeLayupRebound();
  } else {
    return homeLayupFoul();
  }
}

function homeLayupRebound() {
  if (Math.random() <= 0.66) {
    T$.println(`{B}${opponent} controls the rebound.`);
    return AWAY;
  } else {
    T$.println('{R}IU controls the rebound.{W}');
    if (Math.random() <= 0.40) {
      return homeLayup(PLAY_LAYUP);
    } else {
      T$.println('Ball passed back to you.');
      return HOME;
    }
  }
}
    
function instructions() {
  T$.println(`
This is a (very loose) simulation of college basketball.  You will play the
role of Indiana University's team captain and call the plays.

Both teams will always use the same defense.  If you want to change your
defensive strategy during the game, just select '0' for your shot.
`);
}

function jumpBall() {
  T$.println();
  if (Math.random() <= 0.6) {
    T$.println(`{B}${opponent} controls the tap.`);
    return AWAY;
  } else {
    T$.println('{R}IU controls the tap!');
    return HOME;
  }
}

function printScore() {
  T$.println(`{_}\nScore: {R}IU ${score[HOME]} {B}${opponent} ${score[AWAY]}\n`);
}

function tick() {
  time++;
  time = checkHalftime(time);
  time = checkWarning (time);
  time = checkOvertime(time);
}

//------------------------------------------------------------------------------

T$.hello(SOURCE, TITLE, VERSION);
instructions();

let defense  = getDefense();
let opponent = getOpponent();

let time  = 0;
let score = [0, 0];

let ball = jumpBall();

while (time < 100) {
  try {
    if (ball == HOME) {
      T$.println('{R}IU has the ball.{_}');
      const play = getPlay();
      ball = (play == PLAY_15 || play == PLAY_30) ? homeJump() : homeLayup(play);
    } else {
      T$.println(`{B}${opponent} has the ball.{_}`);
      tick();
      const play = (2.5 * Math.random()) + 1;
      ball = (play <= PLAY_30) ? awayJump() : awayLayup(play);
    }
  } catch (err) {
    ball = jumpBall();
  }
}

T$.println('{W}\n*** GAME OVER ***');
printScore();
