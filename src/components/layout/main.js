import { ClassName } from '../../common/constants/index.js';
import {
  Button,
  Element,
  GameField,
  Modal,
  PuzzleSelect,
  Timer,
} from '../index.js';
import { ButtonName, Title } from './constants.js';

// stats
export const puzzleSelect = new PuzzleSelect();
export const timer = new Timer();
const gameStats = new Element(
  { className: ClassName.GameStats },
  puzzleSelect,
  timer
);

export const gameField = new GameField();

// game controls
export const resetBtn = new Button({
  className: 'btn-primary',
  title: Title.ResetBtn,
  text: ButtonName.Reset,
});

export const solutionBtn = new Button({
  className: ClassName.SolutionBtn,
  title: Title.SolutionBtn,
  text: ButtonName.Solution,
});

export const saveBtn = new Button({
  className: 'btn-primary',
  title: Title.SaveBtn,
  text: ButtonName.Save,
});

export const loadBtn = new Button({
  className: 'btn-primary',
  title: Title.LoadBtn,
  text: ButtonName.Load,
});

const gameControls = new Element(
  { className: ClassName.GameControls },
  saveBtn,
  loadBtn,
  solutionBtn,
  resetBtn
);

export const modal = new Modal();

export const main = new Element(
  { className: ClassName.Main, tag: 'main' },
  new Element(
    { className: ClassName.MainWrapper },
    gameStats,
    gameField,
    gameControls,
    modal
  )
);
