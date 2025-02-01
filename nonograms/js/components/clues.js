import { checkArgument, isMatrix, isArray } from '../utils/helpers.js';
import { Element } from './base/element.js';
import { classes as cls, eventName } from '../constants/index.js';
import { Clue } from './clue.js';

export class Clues extends Element {
  #cluesMap = new Map(); // Map<ref,Clue>

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
    clue.dispatchCustom(eventName.clueHasChanged);
  };

  #addInteractivity = () => {
    this.addListener('mousedown', this.#handleMouseDown);
  };

  #appendClues = (cluesMx) => {
    if (!isMatrix(cluesMx)) {
      return;
    }
    const allClues = cluesMx.map((row, rowIdx) => {
      const cluesList = new Element({ className: cls.cluesList });

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

  get values() {
    return [...this.#cluesMap.values()];
  }

  discardAll(force = true) {
    this.values.forEach((clue) => clue.toggleDiscard(force));
  }

  reset() {
    this.discardAll(false);
  }

  // highlight clues row|col
  highlight(rowIdx, force = true) {
    this.children[rowIdx]?.toggleClass(cls.cluesListHighlighted, force);
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
