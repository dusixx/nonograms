import {
  ClassName,
  ColorTheme,
  IconUrl,
  LocalStorageKey,
  Sound,
  SoundState,
} from '../../common/constants/index.js';
import { JSONParse } from '../../common/utils.js';
import { Element, SVGElement } from '../base/index.js';
import {
  gameField,
  modal,
  puzzleSelect,
  soundToggler,
  themeToggler,
  timer,
} from '../layout/index.js';

const MODAL_WIDTH = '250px';

const SOLVE_PUZZLE_SOUND_PLAYBACK_RATE = 10;
const SOUND_PLAYBACK_RATE = 1;
const SOUND_VOLUME = 0.1;
const DEF_SOUND_VOLUME = 1;

export const initAudio = () => {
  Object.entries(Sound).forEach(([name, value]) => {
    value.volume = DEF_SOUND_VOLUME;
    if (!/^solvepuzzle$/i.test(name)) {
      value.playbackRate = SOLVE_PUZZLE_SOUND_PLAYBACK_RATE;
    } else {
      value.volume = SOUND_VOLUME;
      value.playbackRate = SOUND_PLAYBACK_RATE;
    }
  });
};

export const snapshotHelper = {
  getFromLocalStorage() {
    return Object.hasOwn(localStorage, LocalStorageKey.Snapshot)
      ? JSONParse(localStorage.getItem(LocalStorageKey.Snapshot))
      : null;
  },
  saveToLocalStorage() {
    const snapshot = JSON.stringify({
      ...gameField.getSnapshot(),
      ...puzzleSelect.value,
      elapsed: timer.elapsed,
    });
    localStorage.setItem(LocalStorageKey.Snapshot, snapshot);
  },
};

export const showSolvedMessage = (secs) => {
  modal.content.ref.style.width = MODAL_WIDTH;
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

export const playFieldChangedSound = ({ detail: { cell, clue } }) => {
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

export const initSoundToggler = () => {
  const currentSoundState =
    localStorage.getItem(LocalStorageKey.Sound) ?? SoundState.On;

  soundToggler.toggle(currentSoundState === SoundState.On);

  soundToggler.onToggle = (enabled) => {
    localStorage.setItem(
      LocalStorageKey.Sound,
      enabled ? SoundState.On : SoundState.Off
    );
  };
};

export const initColorThemeToggler = () => {
  const currentTheme =
    localStorage.getItem(LocalStorageKey.Theme) ?? ColorTheme.Light;

  const enabled = themeToggler.toggle(currentTheme === ColorTheme.Light);

  document.body.classList.toggle(ClassName.BodyDarkTheme, !enabled);

  themeToggler.onToggle = (enabled) => {
    document.body.classList.toggle(ClassName.BodyDarkTheme, !enabled);
    localStorage.setItem(
      LocalStorageKey.Theme,
      enabled ? ColorTheme.Light : ColorTheme.Dark
    );
  };
};
