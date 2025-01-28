import {
  isFunc,
  isInt,
  isPositiveInt,
  checkArgument,
  JSONParse,
  isMatrix,
} from '../utils/index.js';

import { Element } from './base/element.js';
import { Cell } from './cell.js';
import { CluesHelper } from './clues-helper.js';
import { Clues } from './clues.js';
import { eventName, cellStateFlags } from '../../data/constants.js';
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
    this.addListener(eventName.cellMouseOver, this.#handleCellMouseOver);
    this.addListener(eventName.cellMouseOut, this.#handleCellMouseOut);
    this.addListener('contextmenu', (e) => e.preventDefault());
  };

  #updateCSSVariables = (mx) => {
    const { style } = this.ref;
    style.setProperty(cssVar.gameFieldRows, mx.length);
    style.setProperty(cssVar.gameFieldCols, mx[0]?.length ?? 0);
  };

  update(mx) {
    if (!isMatrix(mx)) {
      return;
    }
    this.#updateCSSVariables(mx);
    const cluesHelper = new CluesHelper(mx);

    this.#cells.update(mx, (cell) => {
      // build clues matrices
      cluesHelper.push(cell);
    });
    // create clues
    const { top, left } = cluesHelper.getClues();
    this.#cluesTop.update(top);
    this.#cluesLeft.update(left);
  }

  reset() {
    this.#cells.reset();
    this.#cluesLeft.reset();
    this.#cluesTop.reset();
  }

  revealSolution() {
    this.#cells.revealSolution();
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

    this.#cells.restoreBySnapshot(cells);
    this.#cluesTop.restoreBySnapshot(cluesTop);
    this.#cluesLeft.restoreBySnapshot(cluesLeft);
  }
}
