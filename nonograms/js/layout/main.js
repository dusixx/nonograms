import { classes as cls, buttonName } from '../constants/index.js';
import { Element, Button } from '../components/index.js';
import { GameField } from '../components/game-field.js';
import { PuzzleSelect } from '../components/puzzle-select.js';
import { Timer } from '../components/timer.js';
import { Score } from '../components/score.js';
import { Modal } from '../components/modal.js';

//
// exports
export {
  main,
  puzzleSelect,
  timer,
  gameField,
  saveBtn,
  loadBtn,
  solutionBtn,
  resetBtn,
  modal,
};
//

//
// Stats
//
const puzzleSelect = new PuzzleSelect();
const timer = new Timer();
const gameStats = new Element(
  { className: cls.gameStats },
  puzzleSelect,
  timer
);

//
// Game field
//
const gameField = new GameField();

//
// Game controls
//
const resetBtn = new Button({
  className: 'btn-primary',
  text: buttonName.reset,
});

const solutionBtn = new Button({
  className: cls.solutionBtn,
  text: buttonName.solution,
});

const saveBtn = new Button({
  className: 'btn-primary',
  text: buttonName.save,
});

const loadBtn = new Button({
  className: 'btn-primary',
  text: buttonName.load,
});

const gameControls = new Element(
  { className: cls.gameControls },
  saveBtn,
  loadBtn,
  solutionBtn,
  resetBtn
);

// const score = new Score();
const modal = new Modal();

// modal.show(
//   'Hello worlddddddddddddddddddddddddddddddddddddddddddddsssssssssssssssssssssssssssssssssssssssss'
// );

// score.add({ puzzleName: 'xxx', lvlName: 'easy', elapsed: 62 });
// score.add({ puzzleName: 'dsss', lvlName: 'easy', elapsed: 625 });
// score.add({ puzzleName: 'dsss', lvlName: 'easy', elapsed: 625 });
// score.add({ puzzleName: 'dsss', lvlName: 'easy', elapsed: 625 });
// score.add({ puzzleName: 'dsss', lvlName: 'easy', elapsed: 625 });

// score.update();

// score.saveToLocalStorage();
// score.loadFromLocalStorage();

const main = new Element(
  { className: cls.main, tag: 'main' },
  new Element(
    { className: cls.mainWrapper },
    gameStats,
    gameField,
    gameControls,
    modal
  )
);
