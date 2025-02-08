import { classes as cls, buttonName, title } from '../constants/index.js';

import {
  Element,
  Button,
  GameField,
  PuzzleSelect,
  Timer,
  Modal,
} from '../components/index.js';

// stats
export const puzzleSelect = new PuzzleSelect();
export const timer = new Timer();
const gameStats = new Element(
  { className: cls.gameStats },
  puzzleSelect,
  timer
);

export const gameField = new GameField();

// game controls
export const resetBtn = new Button({
  className: 'btn-primary',
  title: title.resetBtn,
  text: buttonName.reset,
});

export const solutionBtn = new Button({
  className: cls.solutionBtn,
  title: title.solutionBtn,
  text: buttonName.solution,
});

export const saveBtn = new Button({
  className: 'btn-primary',
  title: title.saveBtn,
  text: buttonName.save,
});

export const loadBtn = new Button({
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

export const modal = new Modal();

export const main = new Element(
  { className: cls.main, tag: 'main' },
  new Element(
    { className: cls.mainWrapper },
    gameStats,
    gameField,
    gameControls,
    modal
  )
);
