import { checkArgument, isMatrix, isArray } from '../utils/helpers.js';
import { Element } from './base/element.js';
import { Clue, cls as clueCls } from './clue.js';

const cls = {
  clues: 'clues',
  highlighted: 'clues--highlighted',
  ...clueCls,
};

export class Clues extends Element {
  #cluesMap = new Map(); // Map<ref,Cell>

  constructor(...args) {
    super(...args);
    this.#addInteractivity();
  }

  #getClueByRef = (ref) => {
    return this.#cluesMap.has(ref) ? this.#cluesMap.get(ref) : null;
  };

  #handleMouseDown = ({ target }) => {
    const clue = this.#getClueByRef(target.closest(`.${cls.clue}`));
    if (!clue) {
      return;
    }
    clue.toggleDiscard();
  };

  #addInteractivity = () => {
    this.addListener('mousedown', this.#handleMouseDown);
  };

  #appendClues = (cluesMx) => {
    if (!isMatrix(cluesMx)) {
      return;
    }
    const allClues = cluesMx.map((row, rowIdx) => {
      const cluesList = new Element({ className: cls.clues });

      const items = row.map((value, colIdx) => {
        const clue = new Clue({ text: value });

        clue.position = { row: rowIdx, col: colIdx };
        this.#cluesMap.set(clue.ref, clue);

        return clue;
      });
      cluesList.append(...items);

      return cluesList;
    });
    this.append(...allClues);
  };

  update(cluesMx) {
    if (!isMatrix(cluesMx)) {
      return;
    }
    this.#cluesMap.clear();
    this.removeChildren();
    this.#appendClues(cluesMx);
  }

  #enumClues = (callback) => {
    this.children.forEach((cellsRow) => {
      cellsRow.children.forEach(callback);
    });
  };

  get values() {
    return [...this.#cluesMap.values()];
  }

  reset() {
    this.values.forEach((clue) => clue.toggleDiscard(false));
  }

  // highlight clues row|col
  highlight(rowIdx, force = true) {
    this.children[rowIdx]?.toggleClass(cls.highlighted, force);
  }

  getSnapshot() {
    return this.children.map((cluesList) => {
      return cluesList.children.map((clue) => Number(clue.isDiscarded));
    });
  }

  restoreBySnapshot(snapshot) {
    if (!isMatrix(snapshot)) {
      return;
    }
    this.values.forEach((clue) => {
      const { row, col } = clue.position;
      clue.isDiscarded = snapshot[row][col];
    });
  }
}
