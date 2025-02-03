import { classes as cls, buttonName, title } from '../constants/index.js';

import {
  Element,
  Button,
  GameField,
  PuzzleSelect,
  Timer,
  Modal,
} from '../components/index.js';

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
  title: title.resetBtn,
  text: buttonName.reset,
});

const solutionBtn = new Button({
  className: cls.solutionBtn,
  title: title.solutionBtn,
  text: buttonName.solution,
});

const saveBtn = new Button({
  className: 'btn-primary',
  title: title.saveBtn,
  text: buttonName.save,
});

const loadBtn = new Button({
  className: 'btn-primary',
  title: title.loadBtn,
  text: buttonName.load,
});

const gameControls = new Element(
  { className: cls.gameControls },
  saveBtn,
  loadBtn,
  solutionBtn,
  resetBtn
);

const modal = new Modal();

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
