// Miscellaneous utility functions for the JS Game Preserve, not tied to any
// particular platform.

/** @const */
module.exports = {
  /**
   * Returns only those elements of |ls| that pass |pred|.
   * @param {function} pred The filtering predicate.
   * @param {Array} ls The array to filter.
   * @returns {Array}
   */
  filter(pred, ls) {
    let ret = [];
    for (x of ls) {
      if (pred(x)) {
        ret.push(x);
      }
    }
    return ret;
  },

  /**
   * Applies |fn| to every element of the array |ls|.
   * @param {function} fn The mapping function.
   * @param {Array} ls The array to map over.
   * @returns {Array}
   */
  map(fn, ls) {
    let ret = [];
    for (x of ls) {
      ret.push(fn(x));
    }
    return ret;
  },

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
  
  /**
   * Builds a list of integers in the range [a, b] inclusive.
   * @param {number} a The minimum value.
   * @param {number} b The maximum value.
   * @returns {Array.<number>}
   */
  range(a, b) {
    let ret = [];
    for (let i = a; i <= b; i++) {
      ret.push(i);
    }
    return ret;
  }
};
