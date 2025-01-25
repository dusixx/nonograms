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

const eventName = {
  solutionFound: 'solutionfound',
  cellMouseDown: 'cellmousedown',
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
  #cellsRef;
  #validCount = 0;
  #started = false;
  // TODO: can be deleted
  #cellsMap = new Map(); //{ref, instance}
  #valid = new Set(); //instances
  #invalid = new Set(); //instances

  constructor(matrix) {
    const cluesTop = new Element({ className: cls.cluesTop });
    const cluesLeft = new Element({ className: cls.cluesLeft });
    const cells = new Element({ className: cls.cells });

    super({ className: cls.gameField }, cluesTop, cluesLeft, cells);
    // init
    this.#cellsRef = cells;
    this.#addInteractivity();
    this.update(matrix);
  }

  // #getCellByRef = (ref) => {
  //   return this.#cellsMap.has(ref) ? this.#cellsMap.get(ref) : null;
  // };

  #wasSolved = () => {
    return this.#valid.size === this.#validCount && this.#invalid.size === 0;
  };

  #handleCellMouseDown = ({ detail: { target: cell } }) => {
    const targetSet = cell.valid ? this.#valid : this.#invalid;
    const action = cell.selected ? 'add' : 'delete';

    targetSet[action](cell);

    if (this.#wasSolved()) {
      this.allowPointerEvents(false);
      this.dispatch(eventName.solutionFound);
    }
  };

  #addInteractivity = () => {
    this.addListener(eventName.cellMouseDown, this.#handleCellMouseDown);
  };

  #applyStyles = (mx) => {
    const { style } = this.ref;
    style.setProperty(cssVar.gameFieldRows, mx.length);
    style.setProperty(cssVar.gameFieldCols, mx[0]?.length ?? 0);
  };

  #makeCells = (mx) => {
    typeExpected(mx, 'Array');

    this.#applyStyles(mx);

    // [ div.cells__row > div.cell,... ]
    return mx.map((rowArr, row) => {
      const cellsRow = new Element({ className: cls.cellsRow });

      const items = rowArr.map((value, col) => {
        const cell = new Cell();
        // init
        this.#cellsMap.set(cell.ref, cell);
        cell.position = { row, col };
        cell.valid = value;

        if (cell.valid) {
          this.#validCount += 1;
        }
        return cell;
      });
      cellsRow.append(...items);

      return cellsRow;
    });
  };

  #init() {
    this.#started = false;
    this.#invalid.clear();
    this.#valid.clear();
    this.allowPointerEvents(true);
  }

  update(matrix) {
    this.#init();

    this.#validCount = 0;
    this.#cellsMap.clear();
    this.#cellsRef.removeChildren();
    // div.cells > div.cells__row*mxSize > div.cell*mxSize
    this.#cellsRef.append(...this.#makeCells(matrix));
  }

  get cells() {
    return [...this.#cellsMap.values()];
  }

  reset() {
    this.#init();
    this.cells.forEach((itm) => itm.reset());
  }

  revealSolution() {
    this.reset();
    this.allowPointerEvents(false);

    this.cells.forEach((itm) =>
      itm.valid ? itm.toggleSelect(true) : itm.reset()
    );
  }
}
