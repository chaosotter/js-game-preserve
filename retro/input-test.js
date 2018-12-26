// This is the main driver file for JS input testing.

/* global goog */
goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.Timer');

let inputDone;
let input = '';

function keyPressedCallback(event) {
  let key = event.charCode;
  
  // Handle non-printable characters specially.
  if (event.charCode === 0) {
    switch (event.keyCode) {
      case goog.events.KeyCodes.BACKSPACE:
      case goog.events.KeyCodes.ENTER:
      case goog.events.KeyCodes.TAB:
        event.preventDefault();
        key = event.keyCode;
        break;
      default:
        return;
    }
  }
  
  buffer(key);
}

function buffer(key) {
  let ch = String.fromCharCode(key);
  
  if (ch === 'x') {
    console.log('Enter');
    inputDone(input);
  } else {
    input += ch;
    document.getElementById('buffer').innerHTML += `[${ch}]`;
  }
}

module.exports = {
  start() {
    console.log('Initializing JS Input Testing.');

    //let redrawCallback = () => { term.draw(); };
    //let redrawTimer = new goog.Timer(16);
    //redrawTimer.start();
    //goog.events.listen(redrawTimer, goog.Timer.TICK, redrawCallback);

    let keyboard = new goog.events.KeyHandler(document, false);
    goog.events.listen(keyboard, goog.events.KeyHandler.EventType.KEY, keyPressedCallback);
  },
  
  input() {
    return new Promise((resolve, reject) => {
      inputDone = resolve;
    });
  },
  
  async inputBlock() {
    let data = await module.exports.input();
    document.getElementById('buffer').innerHTML += `{{{${data}}}}`;
    return data;
  },
};
