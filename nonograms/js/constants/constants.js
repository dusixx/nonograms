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
  hint: 'nng-35fc8f7e525a-hint',
};

export const colorTheme = {
  light: 'light',
  dark: 'dark',
};

export const soundState = {
  on: 'on',
  off: 'off',
};

export const title = {
  resetBtn: 'Restart game',
  solutionBtn: 'Reveal solution',
  saveBtn: 'Save game',
  loadBtn: 'Continue saved game',
  scoreBtn: 'High score table',
  reviewerModeToggler: 'Reviewer mode',
  soundToggler: 'Mute/Unmute',
  themeToggler: 'Theme',
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

export const scoreColumnName = ['#', 'puzzle', 'complexity', 'elapsed'];

export const scoreRewardColor = [
  '#b19859',
  '#89938e',
  '#9d7367',
  '#a7a7a7',
  '#a7a7a7',
];

export const sounds = {
  selectCell: new Audio('./assets/sounds/select.mp3'),
  discardCell: new Audio('./assets/sounds/discard.mp3'),
  clearCell: new Audio('./assets/sounds/clear.mp3'),
  changeClue: new Audio('./assets/sounds/change-clue.mp3'),
  solvePuzzle: new Audio('./assets/sounds/solve-puzzle.mp3'),
};

export const iconUrl = {
  trophy: './assets/icons.svg#icon-trophy5',
  logo: './assets/icons.svg#icon-chess-board',
  star: './assets/icons.svg#icon-star',
  eyeOn: './assets/icons.svg#icon-eye-on',
  eyeOff: './assets/icons.svg#icon-eye-off',
  soundOn: './assets/icons.svg#icon-sound-on6',
  soundOff: './assets/icons.svg#icon-sound-off6',
  moon: './assets/icons.svg#icon-moon3',
  sun: './assets/icons.svg#icon-sun3',
};

export const reviewerModeCellBgColor = 'var(--color-reviewer-mode)';
