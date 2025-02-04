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
} from '../constants/index.js';

export const getSavedSnapshot = () => {
  if (!Object.hasOwn(localStorage, lsKey.snapshot)) {
    return;
  }
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
  return [
    new SVGElement({ className: cls.modalIcon }, { href: iconUrl.trophy }),
    new Element({ tag: 'p', className: cls.modalPara, text }),
  ];
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
  // if (Object.hasOwn(localStorage, lsKey.hint)) {
  //   return;
  // }
  modal.show([
    new Element({ tag: 'img', src: './assets/hint.png', alt: 'hint' }),
    new Element({
      tag: 'p',
      className: cls.modalPara,
      text: 'Use reviewer1 mode',
    }),
  ]);
  localStorage.setItem(lsKey.hint, '1');
};

// init audio
Object.entries(sounds).forEach(([name, value]) => {
  value.volume = 1;
  if (!/^solvepuzzle$/i.test(name)) {
    value.playbackRate = 10;
  } else {
    value.volume = 0.1;
    value.playbackRate = 1;
  }
});
