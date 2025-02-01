import './togglers.js';
import { Element } from '../components/index.js';
import { JSONParse } from '../utils/helpers.js';

import { state } from './state.js';

import {
  eventName,
  localStorageKey as lsKey,
  classes as cls,
} from '../constants/index.js';

import {
  scoreBtn,
  reviewerModeToggler,
  puzzleSelect,
  timer,
  gameField,
  saveBtn,
  loadBtn,
  solutionBtn,
  resetBtn,
} from '../layout/index.js';

document.addEventListener(eventName.reviewerModeChange, () => {
  gameField.toggleReviewerMode(state.reviewerMode);
});

gameField.update(puzzleSelect.puzzleData.mx);

puzzleSelect.onChange = (puzzleData) => {
  gameField.update(puzzleData.mx);
  gameField.toggleReviewerMode(state.reviewerMode);
};

resetBtn.onClick = () => {
  gameField.reset();
  timer.reset();
};

saveBtn.onClick = () => {
  if (!gameField.hasSelectedOrDiscarded()) {
    console.log('nothing to save');
    return;
  }
  const snapshot = JSON.stringify({
    ...gameField.getSnapshot(),
    ...puzzleSelect.value,
    elapsed: timer.elapsed,
  });
  localStorage.setItem(lsKey.snapshot, snapshot);
};

loadBtn.onClick = () => {
  const snapshot = JSONParse(localStorage.getItem(lsKey.snapshot));
  if (!snapshot) {
    console.log('nothing to load');
    return;
  }
  puzzleSelect.update({ ...snapshot, force: true });
  gameField.restoreBySnapshot(snapshot);
  gameField.toggleReviewerMode(state.reviewerMode);

  timer.reset();
  timer.elapsed = snapshot.elapsed;
};

solutionBtn.onClick = () => {
  gameField.revealSolution();
};

gameField.addListener(eventName.cellMouseDownInitial, (e) => {
  timer.start();
  console.log('started');
});
gameField.addListener(eventName.solutionFound, (e) => console.log('You won!'));
