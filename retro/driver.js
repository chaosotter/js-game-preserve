// This is the main driver file for working with the Canvas-based terminal.

let T$ = require('./terminal.js');

/* global goog */
goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.Timer');

let term;

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
  
  term.send(key);
}

module.exports = {
  start() {
    console.log('Initializing Canvas Terminal.');
    term = T$.canvas();
    
    let redrawCallback = () => { term.draw(); };
    let redrawTimer = new goog.Timer(16);
    redrawTimer.start();
    goog.events.listen(redrawTimer, goog.Timer.TICK, redrawCallback);

    let keyboard = new goog.events.KeyHandler(document, false);
    goog.events.listen(keyboard, goog.events.KeyHandler.EventType.KEY, keyPressedCallback);

    window.addEventListener('resize', (e) => { term.screen.resize(e); });
  },
};