import { checkArgument } from '../utils/helpers.js';
import { Element } from './base/element.js';

const cls = {
  clues: 'clues',
  clueItem: 'clues__item',
};

export class Clues extends Element {
  constructor(...args) {
    super(...args);
  }

  update(cluesMatrix) {
    checkArgument(cluesMatrix, 'Array');

    const allClues = cluesMatrix.map((row) => {
      const cluesList = new Element({ tag: 'ul', className: cls.clues });

      const items = row.map((clue) => {
        return new Element({ tag: 'li', className: cls.clueItem, text: clue });
      });
      cluesList.append(...items);

      return cluesList;
    });
    this.append(...allClues);
  }
}
