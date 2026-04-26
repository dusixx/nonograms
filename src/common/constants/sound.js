import changeClueSoundUrl from '@assets/sounds/change-clue.mp3';
import clearSoundUrl from '@assets/sounds/clear.mp3';
import discardSoundUrl from '@assets/sounds/discard.mp3';
import selectSoundUrl from '@assets/sounds/select.mp3';
import solvePuzzleSoundUrl from '@assets/sounds/solve-puzzle.mp3';

export const Sound = {
  SelectCell: new Audio(selectSoundUrl),
  DiscardCell: new Audio(discardSoundUrl),
  ClearCell: new Audio(clearSoundUrl),
  ChangeClue: new Audio(changeClueSoundUrl),
  SolvePuzzle: new Audio(solvePuzzleSoundUrl),
};
