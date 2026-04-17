import { ClassName } from '../../common/constants/class-names.js';
import { Button, Element } from '../base/index.js';

export const createPuzzleSelectView = (lvlNames) => {
  const level = new Element(
    {
      tag: 'select',
      className: ClassName.PuzzleSelectLevel,
    },
    ...lvlNames.map(
      (value) => new Element({ tag: 'option', value, text: value })
    )
  );
  const puzzle = new Element({
    tag: 'select',
    className: ClassName.PuzzleSelectName,
  });
  const random = new Button({
    className: ClassName.PuzzleSelectRandom,
    text: 'random',
  });

  return { level, puzzle, random };
};
