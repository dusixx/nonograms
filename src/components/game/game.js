import { EventName, Sound } from '../../common/constants/index.js';
import {
  gameField,
  loadBtn,
  modal,
  puzzleSelect,
  resetBtn,
  reviewerModeToggler,
  saveBtn,
  scoreBtn,
  solutionBtn,
  soundToggler,
  timer,
} from '../layout/index.js';
import { Score } from '../score.js';
import {
  getSavedSnapshot,
  initAudio,
  playSound,
  saveSnapshot,
  showHintOnce,
  showSolvedMessage,
} from './helpers.js';
import './togglers.js';

//
// Helpers
//

initAudio();
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
// Handlers
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
gameField.addListener(EventName.CellsChangedForTheFirstTime, () => {
  resetBtn.disabled = false;
  timer.start();
});

// solution found
gameField.addListener(EventName.SolutionFound, () => {
  saveBtn.disabled = true;
  solutionBtn.disabled = true;

  gameField.allowPointerEvents(false);
  timer.stop();

  score.add({ ...puzzleSelect.value, elapsed: timer.elapsed });
  score.saveToLocalStorage();

  if (soundToggler.isEnabled) {
    Sound.SolvePuzzle.play();
  }
  showSolvedMessage(timer.elapsed);
});

// game field was changed
gameField.addListener(EventName.GameFieldHasChanged, (e) => {
  playSound(e);
  // available only when there are selected or discarded cells
  saveBtn.disabled = !gameField.hasSelectedOrDiscarded;
  loadBtn.disabled = !getSavedSnapshot();
});
