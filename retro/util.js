// Miscellaneous utility functions for the JS Game Preserve, not tied to any
// particular platform.

/** @const */
module.exports = {
  /**
   * Right-justifies an integer value to fit the given number of columns.
   * @param {number} val The value.
   * @param {number} cols The number of columns
   */
  pad(val, cols) {
    return ('            ' + val).slice(-cols);
  },

  /**
   * Selects a random integer in the range [a, b].
   * @param {number} a The minimum value.
   * @param {number} b The maximum value.
   * @returns {number}
   */
  rand(a, b) {
    return a + Math.floor((b - a + 1) * Math.random());
  },
};
