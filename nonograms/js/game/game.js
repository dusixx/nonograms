import './togglers.js';
import { Score } from '../components/score.js';
import { eventName, sounds } from '../constants/index.js';
import {
  saveSnapshot,
  getSavedSnapshot,
  playSound,
  showHintOnce,
  showSolvedMessage,
} from './helpers.js';
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
  modal,
  soundToggler,
} from '../layout/index.js';

//
//--------------------
// Helpers
//--------------------
//

showHintOnce();

// update score from local storage
const score = new Score();
score.loadFromLocalStorage();

export const init = () => {
  saveBtn.disabled = true;
  resetBtn.disabled = true;
  solutionBtn.disabled = false;
  loadBtn.disabled = !getSavedSnapshot();

  gameField.update(puzzleSelect.puzzleData.mx);
  gameField.toggleReviewerMode(reviewerModeToggler.isEnabled);
  gameField.allowPointerEvents(true);

  timer.reset();
};

const reset = () => {
  saveBtn.disabled = true;
  resetBtn.disabled = true;
  solutionBtn.disabled = false;
  loadBtn.disabled = !getSavedSnapshot();

  gameField.allowPointerEvents(true);
  gameField.reset();

  timer.reset();
};

//
//--------------------
// Handlers
//--------------------
//

scoreBtn.onClick = () => {
  score.loadFromLocalStorage();
  modal.content.ref.style.width = '';
  modal.show(score);
};

// toggle reviewer mode
reviewerModeToggler.onToggle = (enabled) => {
  gameField.toggleReviewerMode(enabled);
};

// reinit game
puzzleSelect.onChange = () => {
  init();
};

// reset current game
resetBtn.onClick = () => {
  reset();
};

// save current game
saveBtn.onClick = () => {
  saveSnapshot();
  saveBtn.disabled = true;
  loadBtn.disabled = true;
};

// load last saved game
loadBtn.onClick = () => {
  const snapshot = getSavedSnapshot();
  if (!snapshot) {
    return;
  }
  loadBtn.disabled = true;
  saveBtn.disabled = true;
  resetBtn.disabled = false;
  solutionBtn.disabled = false;

  puzzleSelect.update({ ...snapshot, force: true });

  gameField.restoreBySnapshot(snapshot);
  gameField.toggleReviewerMode(reviewerModeToggler.isEnabled);
  gameField.allowPointerEvents(true);

  timer.reset();
  timer.elapsed = snapshot.elapsed;
};

// reveal solution
solutionBtn.onClick = () => {
  saveBtn.disabled = true;
  resetBtn.disabled = false;
  solutionBtn.disabled = true;
  loadBtn.disabled = !getSavedSnapshot();

  gameField.allowPointerEvents(false);
  gameField.revealSolution();

  timer.reset();
};

// game was started
gameField.addListener(eventName.cellsChangedForTheFirstTime, () => {
  resetBtn.disabled = false;
  timer.start();
});

// solution found
gameField.addListener(eventName.solutionFound, () => {
  saveBtn.disabled = true;
  solutionBtn.disabled = true;

  gameField.allowPointerEvents(false);
  timer.stop();

  score.add({ ...puzzleSelect.value, elapsed: timer.elapsed });
  score.saveToLocalStorage();

  if (soundToggler.isEnabled) {
    sounds.solvePuzzle.play();
  }
  showSolvedMessage(timer.elapsed);
});

// game field was changed
gameField.addListener(eventName.gameFieldHasChanged, (e) => {
  playSound(e);
  // available only when there are selected or discarded cells
  saveBtn.disabled = !gameField.hasSelectedOrDiscarded;
  loadBtn.disabled = !getSavedSnapshot();
});
