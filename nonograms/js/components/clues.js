import { checkArgument, isArray } from '../utils/helpers.js';
import { Element } from './base/element.js';

const cls = {
  clues: 'clues',
  highlighted: 'clues--highlighted',
  cluesItem: 'clues__item',
  discarded: 'clues__item--discarded',
};

export class Clues extends Element {
  constructor(...args) {
    super(...args);

    this.#addInteractivity();
  }

  get [Symbol.toStringTag]() {
    return 'Clues';
  }

  reset() {
    this.children.forEach((cluesList) => {
      cluesList.children.forEach((itm) => {
        itm.toggleClass(cls.discarded, false);
      });
    });
  }

  createSnapshot() {
    const res = this.children.reduce((res, cluesList, rowIdx) => {
      cluesList.children.forEach((itm, colIdx) => {
        if (itm.ref.classList.contains(cls.discarded)) {
          res.push([rowIdx, colIdx]);
        }
      });
      return res;
    }, []);
    return res;
  }

  restoreBySnapshot(snapshot) {
    if (!isArray(snapshot)) {
      return;
    }
    snapshot.forEach(([row, col]) => {
      this.children[row]?.children[col]?.toggleClass(cls.discarded, true);
    });
  }

  highlight(rowIdx, force = true) {
    this.children[rowIdx]?.toggleClass(cls.highlighted, force);
  }

  #handleMouseDown = ({ target: { classList } }) => {
    if (classList.contains(cls.cluesItem)) {
      classList.toggle(cls.discarded);
    }
  };

  #addInteractivity = () => {
    // disable RMB context menu
    this.addListener('contextmenu', (e) => e.preventDefault());
    this.addListener('mousedown', this.#handleMouseDown);
  };

  update(cluesMatrix) {
    checkArgument(cluesMatrix, 'Array');

    const allClues = cluesMatrix.map((row) => {
      const cluesList = new Element({ tag: 'ul', className: cls.clues });

      const items = row.map((clue) => {
        return new Element({ tag: 'li', className: cls.cluesItem, text: clue });
      });
      cluesList.append(...items);

      return cluesList;
    });
    this.append(...allClues);
  }
}
