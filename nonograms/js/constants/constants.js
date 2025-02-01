export const eventName = {
  solutionFound: 'solutionfound',
  cellMouseDown: 'cellmousedown',
  cellMouseOver: 'cellmouseover',
  cellMouseOut: 'cellmouseout',
  cellHasChanged: 'cellhaschanged',
  cellsChangedForTheFirstTime: 'cellschangedforthefirsttime',
  clueHasChanged: 'cluehaschanged',
  gameFieldHasChanged: 'gamefieldhaschanged',
  reviewerModeHasChanged: 'reviewermodehaschanged',
};

export const cellStateFlags = {
  invalid: 0,
  valid: 1,
  selected: 2,
  discarded: 4,
};

export const mouseBtn = {
  left: 0,
  middle: 1,
  right: 2,
};

export const localStorageKey = {
  snapshot: 'nng-35fc8f7e525a-snapshot',
  theme: 'nng-35fc8f7e525a-theme',
  sound: 'nng-35fc8f7e525a-sound',
  score: 'nng-35fc8f7e525a-score',
};

export const colorTheme = {
  light: 'light',
  dark: 'dark',
};

export const soundState = {
  on: 'on',
  off: 'off',
};

export const buttonName = {
  reset: 'reset',
  solution: 'solution',
  save: 'save',
  load: 'load',
};

export const message = {
  haveSolved(secs) {
    return `Great! You have solved the nonogram in ${secs} seconds!`;
  },
};
