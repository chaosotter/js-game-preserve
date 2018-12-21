# The JS Game Preserve

This project contains a collection of classic microcomputer games, mostly from
the 8-bit era, in both their original forms and converted to modern (ES6)
Javascript.

The Game Preserve is in its very earliest stages, but here are some themes you
can expect as the project evolves:

* Each game will include metadata describing the provenance of the game and up
  to three versions:

  1. A version as faithful to the original source as possible, which may take
     the form of tokenized BASIC files for the original platforms;
  2. A version tested to work with the [QB64](http://qb64.org/) BASIC system.
  3. A JS version written to work either in a Web page **or** from the console
     through Node.js.

* The JS versions will operate through an abstraction layer called "Retro" that
  provides the appropriate functionality from the original platform, such as
  hardware sprites, sound, bitmapped character sets, and so forth.

## Current status

An adapter for terminal-based games is under construction, including support for
color and either line or character-based input.  The initial version supports
only the console-based mode of operation through Node.js.

The initial games are being drawn from the classic book [BASIC Computer Games,
Microcomputer Edition](https://en.wikipedia.org/wiki/BASIC_Computer_Games),
edited by David H. Ahl.

## Great!  Can I contribute?

Eventually, sure!  The project is not ready just yet for large-scale external
contribution, but of course the maintainers would love to receive bug fixes and
other tweaks.