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
  #refSum = 0;
  #curSum = 0;
  #started = false;
  #cellsMap = new Map(); //{ref, instance}
  #invalids = new Set(); //instances

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
    return this.#refSum === this.#curSum && !this.#invalids.size;
  };

  #handleCellMouseDown = ({ detail: { target: cell } }) => {
    if (cell.highlighted) {
      if (cell.valid) {
        this.#curSum += 1;
      } else {
        this.#invalids.add(cell);
      }
    } else {
      if (cell.valid) {
        this.#curSum -= 1;
      } else {
        this.#invalids.delete(cell);
      }
    }
    console.log(this.#refSum, this.#curSum, this.#invalids.size);
    if (this.#wasSolved()) {
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
    this.#curSum = 0;
    this.#started = false;
    this.#invalids.clear();
  }

  update(matrix) {
    this.#init();

    this.#refSum = 0;
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
    this.cells.forEach((itm) =>
      itm.valid ? itm.toggleHighlight(true) : itm.reset()
    );
  }
}
