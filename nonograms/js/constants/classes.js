const sectionClasses = {
  main: 'main',
  mainWrapper: 'main__wrapper',
  header: 'header',
  headerWrapper: 'header__wrapper',
};

const gameFieldClasses = {
  gameField: 'game-field',
  // cells
  cell: 'cell',
  cellSelected: 'cell--selected',
  cellDiscarded: 'cell--discarded',
  cells: 'cells',
  cellsRow: 'cells__row',
  // clues
  clue: 'clue',
  clueDiscarded: 'clue--discarded',
  cluesList: 'clues-list',
  cluesListHighlighted: 'clues-list--highlighted',
  cluesLeft: 'clues-left',
  cluesTop: 'clues-top',
};

export const classes = {
  ...sectionClasses,
  ...gameFieldClasses,
  // puzzle select
  puzzleSelect: 'puzzle-select',
  puzzleSelectLvl: 'custom-select',
  puzzleSelectPic: 'custom-select',
  puzzleSelectRnd: 'btn-secondary',
  // misc
  timer: 'timer',
  toggler: 'toggler',
  togglerIcon: 'toggler__icon',
  // logo
  logo: 'logo',
  logoText: 'logo__text',
  logoIcon: 'logo__icon',
  headerControls: 'header__controls',
  scoreBtn: 'score-btn',
  scoreBtnIcon: 'score-btn__icon',
  bodyDarkTheme: 'dark-theme',
  gameControls: 'game-controls',
  solutionBtn: 'btn-primary',
  gameStats: 'game-stats',
};
