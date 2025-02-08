import { soundToggler, themeToggler } from '../layout/header.js';
import {
  localStorageKey as lsKey,
  soundState,
  colorTheme,
  classes as cls,
} from '../constants/index.js';

// Sound
const currentSoundState = localStorage.getItem(lsKey.sound) ?? soundState.on;
soundToggler.toggle(currentSoundState === soundState.on);

soundToggler.onToggle = (enabled) => {
  localStorage.setItem(lsKey.sound, enabled ? soundState.on : soundState.off);
};

// Color theme
const currentTheme = localStorage.getItem(lsKey.theme) ?? colorTheme.light;

const enabled = themeToggler.toggle(currentTheme === colorTheme.light);
document.body.classList.toggle(cls.bodyDarkTheme, !enabled);

themeToggler.onToggle = (enabled) => {
  document.body.classList.toggle(cls.bodyDarkTheme, !enabled);
  localStorage.setItem(
    lsKey.theme,
    enabled ? colorTheme.light : colorTheme.dark
  );
};
