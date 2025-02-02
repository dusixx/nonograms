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

export const scoreColumnName = ['#', 'puzzle', 'complexity', 'elapsed'];

export const scoreRewardColor = [
  '#a98d33',
  '#768d81',
  '#9d7265',
  '#a5a3a3',
  '#a5a3a3',
];

export const sounds = {
  selectCell: new Audio('./assets/sounds/select.mp3'),
  discardCell: new Audio('./assets/sounds/discard.mp3'),
  clearCell: new Audio('./assets/sounds/clear.mp3'),
  clueChanged: new Audio('./assets/sounds/clue-changed.mp3'),
  solved: new Audio('./assets/sounds/won.mp3'),
};

Object.entries(sounds).forEach(([name, value]) => {
  value.volume = 1;
  if (name !== 'solved') {
    value.playbackRate = 10;
  } else {
    value.playbackRate = 1.5;
  }
});
