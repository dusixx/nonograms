import { JSONParse, isMatrix } from '../utils/index.js';
import { Element } from './base/element.js';
import { Clues } from './clues.js';
import { eventName } from '../../data/constants.js';
import { Cells } from './cells.js';

const cls = {
  gameField: 'game-field',
  cluesLeft: 'clues-left',
  cluesTop: 'clues-top',
};

const cssVar = {
  gameFieldRows: '--game-field-rows',
  gameFieldCols: '--game-field-cols',
};

//
//------------------
// GameField
//------------------
//

export class GameField extends Element {
  #cells;
  #cluesLeft;
  #cluesTop;

  constructor(mx) {
    super({ className: cls.gameField });

    this.#cluesTop = new Clues({ className: cls.cluesTop });
    this.#cluesLeft = new Clues({ className: cls.cluesLeft });
    this.#cells = new Cells();

    this.append(this.#cluesTop, this.#cluesLeft, this.#cells);
    this.#addInteractivity();
    this.update(mx);
  }

  #handleCellMouseOver = ({ detail: { target: cell } }) => {
    const { row, col } = cell.position;
    this.#cluesLeft.highlight(row, true);
    this.#cluesTop.highlight(col, true);
  };

  #handleCellMouseOut = ({ detail: { target: cell } }) => {
    const { row, col } = cell.position;
    this.#cluesLeft.highlight(row, false);
    this.#cluesTop.highlight(col, false);
  };

  #addInteractivity = () => {
    this.addListener('contextmenu', (e) => e.preventDefault());
    this.addListener(eventName.cellMouseOver, this.#handleCellMouseOver);
    this.addListener(eventName.cellMouseOut, this.#handleCellMouseOut);
  };

  update(mx) {
    if (!isMatrix(mx)) {
      return;
    }
    const { style } = this.ref;
    style.setProperty(cssVar.gameFieldRows, mx.length);
    style.setProperty(cssVar.gameFieldCols, mx[0]?.length ?? 0);

    const { cluesTop, cluesLeft } = this.#cells.update(mx);
    this.#cluesTop.update(cluesTop);
    this.#cluesLeft.update(cluesLeft);
  }

  reset() {
    this.#cells.reset();
    this.#cluesLeft.reset();
    this.#cluesTop.reset();
  }

  revealSolution() {
    this.#cells.revealSolution();
    this.#cluesTop.discardAll();
    this.#cluesLeft.discardAll();
  }

  toggleReviewerMode(force) {
    return this.#cells.toggleReviewerMode(force);
  }

  getSnapshot() {
    return {
      cells: this.#cells.getSnapshot(),
      cluesLeft: this.#cluesLeft.getSnapshot(),
      cluesTop: this.#cluesTop.getSnapshot(),
    };
  }

  restoreBySnapshot(snapshot) {
    const { cells, cluesTop, cluesLeft } = JSONParse(snapshot) ?? '';

    this.update(cells);
    this.#cluesTop.restoreBySnapshot(cluesTop);
    this.#cluesLeft.restoreBySnapshot(cluesLeft);
  }
}
