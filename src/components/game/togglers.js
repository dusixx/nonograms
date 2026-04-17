import {
  ClassName,
  ColorTheme,
  LocalStorageKey,
  SoundState,
} from '../../common/constants/index.js';
import { soundToggler, themeToggler } from '../layout/header.js';

// sound
const currentSoundState =
  localStorage.getItem(LocalStorageKey.Sound) ?? SoundState.On;
soundToggler.toggle(currentSoundState === SoundState.On);

soundToggler.onToggle = (enabled) => {
  localStorage.setItem(
    LocalStorageKey.Sound,
    enabled ? SoundState.On : SoundState.Off
  );
};

// color theme
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
