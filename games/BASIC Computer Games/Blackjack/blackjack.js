var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Blackjack';
const VERSION = '1.0.1';

function instructions() {
  T$.println(`
This is the game of 21.  As many as 7 players may play the game.  On each deal,
bets will be asked for, and the players' bets should be typed in.  The cards
will then be dealt, and each player in turn plays their hand.

In order to collect for blackjack, the initial response must be to stand.
`);
}

//------------------------------------------------------------------------------

class Card {
  constructor(n) {
    this.n = n;
  }
  
  string() {
    let color = Math.floor((this.n / 13) < 2) ? '{R}' : '{W}';
    return (
        color +
        ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'][this.n % 13] +
        ['♦', '♥', '♠', '♣'][Math.floor(this.n / 13)] +
        '{_}');
  }

  /** Returns the card value, where A=11 and J/Q/K=10. */
  value() {
    const n = this.n % 13;
    if (n == 12) {
      return 11;
    } else if (n >= 8) {
      return 10;
    } else {
      return n + 2;
    }
  }
}

class Deck {
  constructor() {
    this.cards = [];
    for (let i = 0; i < 52; i++) {
      this.cards.push(new Card(i));
    }
    this.shuffle();
    this.next = 0;
  }
  
  deal() {
    if (this.next >= this.cards.length) {
      this.shuffle();
    }
    return this.cards[this.next++];
  }
  
  shuffle() {
    T$.println('{C}Shuffling the deck...{_}');
    U$.shuffle(this.cards);
    this.next = 0;
  }
}

class Player {
  constructor(name) {
    this.name = name;
    this.total = 0;
    this.reset();
  }

  aceShown() {
    return this.hand[0].value() === 11;
  }

  add(card) {
    this.hand.push(card);
    if (this.value() > 21) {
      T$.println(`{R}${this.name} has busted with a total of ${this.value()}!`);
    }
  }
  
  finalize() {
    this.total += this.handTotal;
  }
  
  isDealer() {
    return this.name === 'Dealer';
  }
  
  reset() {
    this.bet = 0;
    this.hand = [];
    this.handTotal = 0;
    this.split = null;
  }

  value() {
    let aces = 0, total = 0;
    for (let card of this.hand) {
      const val = card.value();
      total += val;
      aces += (val == 11);
    }
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  }
}

//------------------------------------------------------------------------------

let deck = new Deck();

async function getBets(players) {
  T$.println('{_}');
  for (let player of players) {
    player.bet = await T$.inputNumber(`Enter bet for ${player.name} (1-500): `, 1, 500);
  }
}

async function getChoice(player, isFirst) {
  let choice;
  do {
    T$.print(`{_}Your total is ${player.value()}.  `);
    if (isFirst) {
      choice = await T$.input(`{G}H{_}it, {G}S{_}tand, or {G}D{_}ouble down (h/s/d)? `);
    } else {
      choice = await T$.input(`{G}H{_}it or {G}S{_}tand (h/s)? `);
    }
  } while (choice !== 'h' && choice !== 's' && !(isFirst && choice === 'd'));
  return choice;
}

async function handleInsurance(needed, players) {
  for (let player of players) {
    const max = Math.floor(player.bet / 2);
    const ins = await T$.inputNumber(`Insurance for ${player.name} (0-${max}): `, 0, max);
    if (needed) {
      player.handTotal += ins * 2;
    }
  }
  T$.println();
}

function initialDeal(players) {
  for (let player of players) {
    player.add(deck.deal());
    player.add(deck.deal());
  }
  
  T$.println();
  for (let player of players) {
    T$.print('{M}', U$.ljustify(player.name, 10));
    if (player.isDealer()) {
      T$.print(U$.rjustify(player.hand[0].string(), 5 + 6));  // +6 for color codes
      T$.println(U$.rjustify('{G}??{_}', 5 + 6));
    } else {
      for (let card of player.hand) {
        T$.print(U$.rjustify(card.string(), 5 + 6));  // +6 for color codes
      }
      T$.println(`  {_}(Total: ${player.value()})`);
    }
  }
}

function playDealer(dealer) {
  T$.println(`\n{_}The dealer had ${dealer.hand[1].string()} concealed for a total of ${dealer.value()}.`);
  while (dealer.value() <= 16) {
    let card = deck.deal();
    T$.println(`Dealer draws ${card.string()}`);
    dealer.add(card);
  }
  if (dealer.value() <= 21) {
    T$.println(`Dealer stands with a total of ${dealer.value()}.`);
  }
}

async function playHand(player) {
  T$.println(`\n{W}${player.name}, you're up!`);
  if (player.hand[0].value() === player.hand[1].value() &&
      await T$.inputYN('Do you want to split (y/n)? ')) {
    await playSplit(player);
  } else {
    await playSingleHand(player);
  }
}

async function playSingleHand(player) {
  let choice, isFirst = true;
  do {
    choice = await getChoice(player, isFirst);
    switch (choice) {
      case 'h':
        const card = deck.deal();
        T$.println(`{_}You drew ${card.string()}`);
        player.add(card);
        break;
      case 's':
        if (isFirst && player.value() == 21) {
          T$.println('{G}Blackjack!');
          player.handTotal = Math.floor(1.5 * player.bet);
          player.bet = 0;  // bet is now resolved, so clear it
        }
        break;
      case 'd':
        player.bet *= 2;
        break;
    }
    isFirst = false;
  } while (player.value() <= 21 && choice != 's');
}

async function playSplit(player) {
  // Store a new temporary player for the split hand.
  player.split = new Player(player.name);
  player.split.bet = player.bet;
  player.split.hand = [player.hand[1]];
  player.split.handTotal = player.handTotal;
  player.hand = [player.hand[0]];
  
  // Deal cards to the split hands.
  player.add(deck.deal());
  T$.println(`{_}The first hand draws ${player.hand[player.hand.length-1].string()}`);
  player.split.add(deck.deal());
  T$.println(`{_}The second hand draws ${player.split.hand[player.split.hand.length-1].string()}`);

  // Play the both hands.
  T$.println(`\n{C}Now playing hand #1`);
  await playSingleHand(player, true);
  T$.println('\n{C}Now playing hand #2');
  await playSingleHand(player.split, true);
}

function resolveRound(dealer, players) {
  T$.println();
  for (let player of players) {
    const adjust = function(p) {
      if (p.value() <= 21 && (dealer.value() > 21 || p.value() > dealer.value())) {
        player.handTotal += p.bet;
      } if (p.value() > 21 || (p.value() < dealer.value() && dealer.value() <= 21)) {
        player.handTotal -= p.bet;
      }
    };

    adjust(player);
    if (player.split) {
      adjust(player.split);
    }
    dealer.handTotal -= player.handTotal;

    T$.print(`{_}${player.name} `);
    if (player.handTotal > 0) {
      T$.print(`{G}wins $${player.handTotal} `);
    } else if (player.handTotal < 0) {
      T$.print(`{R}loses $${Math.abs(player.handTotal)} `);
    } else {
      T$.print('pushes ');
    }
    player.finalize();
    T$.println(`{_}for a total of $${player.total}.`);
  }
  
  dealer.finalize();
  T$.println(`The dealer now has $${dealer.total}.\n`);
}

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();

  let num = await T$.inputNumber('Number of players (1-7)? ', 1, 7);
  let players = [new Player('Dealer')];
  for (let i = 1; i <= num; i++) {
    players.push(new Player(`Player ${i}`));
  }
  
  let done = false;
  while (!done) {
    for (let player of players) {
      player.reset();
    }
    
    await getBets(players.slice(1));
    initialDeal(players);
    
    if (players[0].aceShown() && await T$.inputYN('Any insurance (y/n)? ')) {
      await handleInsurance(players[0].hand[1].value() === 10, players.slice(1));
    }
    
    if (players[0].value() === 21) {
      T$.println(`{R}Dealer has ${players[0].hand[1].string()} in the hole for Blackjack!`);
    } else {
      if (players[0].hand[0].value() >= 10) {
        T$.println(`{_}Dealer does not have Blackjack.`);
      }
      for (let player of players.slice(1)) {
        await playHand(player);
      }
    }

    playDealer(players[0]);
    resolveRound(players[0], players.slice(1));

    done = !(await T$.inputYN('Another round (y/n)? '));
  }
}

main();
