var T$ = require('../../../retro/terminal.js');
var U$ = require('../../../retro/util.js');

const SOURCE  = 'BASIC Computer Games';
const TITLE   = 'Buzzword Generator';
const VERSION = '1.0.0';

const A = [
  'ability',
  'basal',
  'behavioral',
  'child-centered',
  'differentiated',
  'discovery',
  'flexible',
  'heterogeneous',
  'homogeneous',
  'manipulative',
  'modular',
  'Tavistock',
  'individualized',
];

const B = [
  'learning',
  'evaluative',
  'objective',
  'cognitive',
  'enrichment',
  'scheduling',
  'humanistic',
  'integrated',
  'non-graded',
  'training',
  'vertical age',
  'motivational',
  'creative',
];

const C = [
  'grouping',
  'modification',
  'accountability',
  'process',
  'core curriculum',
  'algorithm',
  'performance',
  'reinforcement',
  'open classroom',
  'resource',
  'structure',
  'facility',
  'environment',
];

function instructions() {
  T$.println(`
This program prints highly acceptable phrases in "educator-speak" that you can
work into reports and speeches.  Whenever prompted, type 'y' for another phrase
or 'n' to quit.
`);
}

async function main() {
  T$.hello(SOURCE, TITLE, VERSION);
  instructions();
  
  do {
    T$.println(`{B}${U$.randItem(A)} ${U$.randItem(B)} ${U$.randItem(C)}{_}`);
  } while (await T$.inputYN('Another (y/n)? '));
  
  T$.println('Come back when you need help with another report!');
}

main();
