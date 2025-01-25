import { Element } from './base/element.js';
import { Cell } from './cell.js';
import {
  isArray,
  isFunc,
  isInt,
  isPositiveInt,
  typeExpected,
} from '../utils/index.js';

const cls = {
  gameField: 'game-field',
  cells: 'cells',
  cellsRow: 'cells__row',
  cluesLeft: 'clues-left',
  cluesTop: 'clues-top',
};

//
//------------------
// GameField
//------------------
//

export class GameField extends Element {
  #cellsRef;
  #refSum = 0;
  #curSum = 0;
  #valid = true;
  #started = false;
  #cellsMap = new Map(); //{ref, instance}
  #onSolve;
  #onStart;

  constructor(mx) {
    const cluesTop = new Element({ className: cls.cluesTop });
    const cluesLeft = new Element({ className: cls.cluesLeft });
    const cells = new Element({ className: cls.cells });

    super({ className: cls.gameField }, cluesTop, cluesLeft, cells);
    // init
    this.#cellsRef = cells;
    this.#addInteractivity();
    this.update(mx);
  }

  #getCellByRef = (ref) => {
    return this.#cellsMap.has(ref) ? this.#cellsMap.get(ref) : null;
  };

  #checkResult = (cell) => {
    this.#valid &&= cell.valid;
    if (cell.valid) {
      this.#curSum += 1;
    } else {
      this.#curSum -= 1;
    }
    if (this.#curSum === this.#refSum && this.#valid) {
      this.#onSolve?.();
    }
  };

  #handleMouseDown = (e) => {
    const cell = this.#getCellByRef(e.target);
    if (!cell) {
      return;
    }
    this.#started = true;
    this.#checkResult(cell);
  };

  #addInteractivity = () => {
    this.addListener('mousedown', this.#handleMouseDown);
  };

  #makeCells = (mx) => {
    typeExpected(mx, 'Array');

    // [ div.cells__row > div.cell,... ]
    return mx.map((rowArr, row) => {
      const cellsRow = new Element({ className: cls.cellsRow });

      const items = rowArr.map((value, col) => {
        const cell = new Cell();

        this.#cellsMap.set(cell.ref, cell);
        cell.position = { row, col };
        cell.valid = value;

        // calc reference matrix sum
        if (cell.valid) {
          this.#refSum += 1;
        }
        return cell;
      });
      cellsRow.append(...items);

      return cellsRow;
    });
  };

  #init() {
    this.#started = false;
    this.#valid = true;
    this.#curSum = 0;
    this.#refSum = 0;
  }

  update(mx) {
    this.#init();

    this.#cellsMap = new Map();
    this.#cellsRef.removeChildren();
    // div.cells > div.cells__row*mxSize > div.cell*mxSize
    this.#cellsRef.append(...this.#makeCells(mx));
  }

  get cells() {
    return [...this.#cellsMap.values()];
  }

  reset() {
    this.#init();
    this.cells().forEach((itm) => itm.reset());
  }

  revealSolution() {
    this.cells().forEach((itm) =>
      itm.valid ? itm.toggleHighlight(true) : itm.reset()
    );
  }

  set onSolve(handler) {
    this.#onSolve = isFunc(handler) ? handler : null;
  }

  set onStart(handler) {
    this.#onStart = isFunc(handler) ? handler : null;
  }
}
