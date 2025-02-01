import { gameField, puzzleSelect, timer } from '../layout/main.js';
import { localStorageKey as lsKey } from '../constants/constants.js';
import { JSONParse } from '../utils/helpers.js';

export const getSavedSnapshot = () => {
  return JSONParse(localStorage.getItem(lsKey.snapshot));
};

export const saveSnapshot = () => {
  const snapshot = JSON.stringify({
    ...gameField.getSnapshot(),
    ...puzzleSelect.value,
    elapsed: timer.elapsed,
  });
  localStorage.setItem(lsKey.snapshot, snapshot);
};
