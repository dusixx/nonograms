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
  initAudio,
  initTogglers,
  playFieldChangedSound,
  showSolvedMessage,
  snapshotHelper,
} from './game.utils.js';

export class Game {
  #score;

  constructor() {
    initAudio();
    initTogglers();

    this.#score = new Score();
    this.#score.loadFromLocalStorage();

    this.#initGameField();
    this.#initControls();
    this.init();
  }

  init() {
    saveBtn.disabled = true;
    resetBtn.disabled = true;
    solutionBtn.disabled = false;
    loadBtn.disabled = !snapshotHelper.getFromLocalStorage();

    gameField.update(puzzleSelect.puzzleData.mx);
    gameField.toggleReviewerMode(reviewerModeToggler.isEnabled);
    gameField.allowPointerEvents(true);

    timer.reset();
  }

  reset() {
    saveBtn.disabled = true;
    resetBtn.disabled = true;
    solutionBtn.disabled = false;
    loadBtn.disabled = !snapshotHelper.getFromLocalStorage();

    gameField.allowPointerEvents(true);
    gameField.reset();

    timer.reset();
  }

  #initGameField() {
    // game was started
    gameField.addListener(EventName.CellsChangedForTheFirstTime, () => {
      resetBtn.disabled = false;
      timer.start();
    });

    gameField.addListener(EventName.SolutionFound, () => {
      saveBtn.disabled = true;
      solutionBtn.disabled = true;

      gameField.allowPointerEvents(false);
      timer.stop();

      this.#score.add({ ...puzzleSelect.value, elapsed: timer.elapsed });
      this.#score.saveToLocalStorage();

      if (soundToggler.isEnabled) {
        Sound.SolvePuzzle.play();
      }
      showSolvedMessage(timer.elapsed);
    });

    gameField.addListener(EventName.GameFieldHasChanged, (e) => {
      playFieldChangedSound(e);
      saveBtn.disabled = !gameField.hasSelectedOrDiscarded;
      loadBtn.disabled = !snapshotHelper.getFromLocalStorage();
    });
  }

  #initControls() {
    scoreBtn.onClick = () => {
      this.#score.loadFromLocalStorage();
      modal.content.ref.style.width = '';
      modal.show(this.#score);
    };

    reviewerModeToggler.onToggle = (enabled) => {
      gameField.toggleReviewerMode(enabled);
    };

    puzzleSelect.onChange = () => {
      this.init();
    };

    resetBtn.onClick = () => {
      this.reset();
    };

    saveBtn.onClick = () => {
      snapshotHelper.saveToLocalStorage();
      saveBtn.disabled = true;
      loadBtn.disabled = true;
    };

    loadBtn.onClick = () => {
      const snapshot = snapshotHelper.getFromLocalStorage();
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

    solutionBtn.onClick = () => {
      saveBtn.disabled = true;
      resetBtn.disabled = false;
      solutionBtn.disabled = true;
      loadBtn.disabled = !snapshotHelper.getFromLocalStorage();

      gameField.allowPointerEvents(false);
      gameField.revealSolution();

      timer.reset();
    };
  }
}
