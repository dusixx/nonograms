import hintImageUrl from '../../assets/hint.png';
import { JSONParse } from '../../common/utils.js';
import { Element, SVGElement } from '../base/index.js';

import {
  gameField,
  modal,
  puzzleSelect,
  soundToggler,
  timer,
} from '../layout/index.js';

import {
  ClassName,
  IconUrl,
  LocalStorageKey,
  Sound,
} from '../../common/constants/index.js';

const HINT_MESSAGE =
  'Click on this button in the header to speed up the task check';

export const getSavedSnapshot = () => {
  return Object.hasOwn(localStorage, LocalStorageKey.Snapshot)
    ? JSONParse(localStorage.getItem(LocalStorageKey.Snapshot))
    : null;
};

export const saveSnapshot = () => {
  const snapshot = JSON.stringify({
    ...gameField.getSnapshot(),
    ...puzzleSelect.value,
    elapsed: timer.elapsed,
  });
  localStorage.setItem(LocalStorageKey.Snapshot, snapshot);
};

export const showSolvedMessage = (secs) => {
  modal.content.ref.style.width = '250px';
  modal.show(
    new SVGElement(
      { className: ClassName.ModalIcon },
      { href: IconUrl.Trophy }
    ),
    new Element({
      tag: 'p',
      className: ClassName.ModalPara,
      text: `Great! You have solved the nonogram in ${secs} seconds!`,
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
    Sound.ChangeClue.play();
    return;
  }
  // cell
  const { isDiscarded, isSelected } = cell;
  if (isSelected) {
    Sound.SelectCell.play();
  } else if (isDiscarded) {
    Sound.DiscardCell.play();
  } else {
    Sound.ClearCell.play();
  }
};

export const showHintOnce = () => {
  if (Object.hasOwn(localStorage, LocalStorageKey.Hint)) {
    return;
  }
  modal.content.ref.style.width = '250px';
  modal.show(
    new Element({ tag: 'img', src: hintImageUrl, alt: 'hint' }),
    new Element({
      tag: 'p',
      className: ClassName.ModalPara,
      text: HINT_MESSAGE,
    })
  );
  localStorage.setItem(LocalStorageKey.Hint, '1');
};

export const initAudio = () => {
  Object.entries(Sound).forEach(([name, value]) => {
    value.volume = 1;
    if (!/^solvepuzzle$/i.test(name)) {
      value.playbackRate = 10;
    } else {
      value.volume = 0.1;
      value.playbackRate = 1;
    }
  });
};
