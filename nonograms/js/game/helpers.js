import { Element, SVGElement } from '../components/index.js';
import { gameField, puzzleSelect, timer } from '../layout/main.js';
import { soundToggler } from '../layout/header.js';
import {
  localStorageKey as lsKey,
  classes as cls,
  message,
  sounds,
} from '../constants/index.js';
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

export const getSolvedMessage = (secs) => {
  const text = message.haveSolved(secs);
  return new Element(
    { className: cls.solvedMsg },
    new SVGElement(
      { className: cls.solvedMsgIcon },
      { href: './assets/icons.svg#icon-trophy5' }
    ),
    new Element({ tag: 'p', className: cls.solvedMsgText, text })
  );
};

// on 'gamefieldhaschanged'
export const playSound = ({ detail: { cell, clue } }) => {
  if (!soundToggler.isEnabled) {
    return;
  }
  if (clue) {
    sounds.clueChanged.play();
    return;
  }
  const { isDiscarded, isSelected } = cell;
  if (isSelected) {
    sounds.selectCell.play();
  } else if (isDiscarded) {
    sounds.discardCell.play();
  } else {
    sounds.clearCell.play();
  }
};
