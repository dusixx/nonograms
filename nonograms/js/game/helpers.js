import { Element, SVGElement } from '../components/base/index.js';
import { JSONParse } from '../utils/helpers.js';

import {
  gameField,
  puzzleSelect,
  timer,
  soundToggler,
  modal,
} from '../layout/index.js';

import {
  localStorageKey as lsKey,
  classes as cls,
  message,
  sounds,
  iconUrl,
  reviewerModeOpts,
} from '../constants/index.js';

export const getSavedSnapshot = () => {
  return Object.hasOwn(localStorage, lsKey.snapshot)
    ? JSONParse(localStorage.getItem(lsKey.snapshot))
    : null;
};

export const saveSnapshot = () => {
  const snapshot = JSON.stringify({
    ...gameField.getSnapshot(),
    ...puzzleSelect.value,
    elapsed: timer.elapsed,
  });
  localStorage.setItem(lsKey.snapshot, snapshot);
};

export const showSolvedMessage = (secs) => {
  modal.content.ref.style.width = '250px';
  modal.show(
    new SVGElement({ className: cls.modalIcon }, { href: iconUrl.trophy }),
    new Element({
      tag: 'p',
      className: cls.modalPara,
      text: message.haveSolved(secs),
    })
  );
};

// on 'gamefieldhaschanged'
export const playSound = ({ detail: { cell, clue } }) => {
  if (!soundToggler.isEnabled) {
    return;
  }
  // clue
  if (clue) {
    sounds.changeClue.play();
    return;
  }
  // cell
  const { isDiscarded, isSelected } = cell;
  if (isSelected) {
    sounds.selectCell.play();
  } else if (isDiscarded) {
    sounds.discardCell.play();
  } else {
    sounds.clearCell.play();
  }
};

export const showHintOnce = () => {
  if (Object.hasOwn(localStorage, lsKey.hint)) {
    return;
  }
  modal.content.ref.style.width = '250px';
  modal.show(
    new Element({ tag: 'img', src: reviewerModeOpts.imgSrc, alt: 'hint' }),
    new Element({
      tag: 'p',
      className: cls.modalPara,
      text: reviewerModeOpts.hintMsg,
    })
  );
  localStorage.setItem(lsKey.hint, '1');
};

export const initAudio = () => {
  Object.entries(sounds).forEach(([name, value]) => {
    value.volume = 1;
    if (!/^solvepuzzle$/i.test(name)) {
      value.playbackRate = 10;
    } else {
      value.volume = 0.1;
      value.playbackRate = 1;
    }
  });
};
