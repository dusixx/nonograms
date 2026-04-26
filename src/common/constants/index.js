export * from './class-name.js';
export * from './event-name.js';
export * from './icon.js';
export * from './sound.js';

export const CellStateFlags = {
  Invalid: 0,
  Valid: 1,
  Selected: 2,
  Discarded: 4,
};

export const MouseButton = {
  Left: 0,
  Middle: 1,
  Right: 2,
};

const LS_PREFIX = 'nng-35fc8f7';

export const LocalStorageKey = {
  Snapshot: `${LS_PREFIX}-snapshot`,
  Theme: `${LS_PREFIX}-theme`,
  Sound: `${LS_PREFIX}-sound`,
  Score: `${LS_PREFIX}-score`,
  Hint: `${LS_PREFIX}-hint`,
};

export const ColorTheme = {
  Light: 'light',
  Dark: 'dark',
};

export const SoundState = {
  On: 'on',
  Off: 'off',
};

export const CSSVars = {
  GameFieldRows: '--game-field-rows',
  GameFieldCols: '--game-field-cols',
};
