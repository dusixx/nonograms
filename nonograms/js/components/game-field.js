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
    // solved
    if (this.#refSum === this.#curSum && !this.#invalids.size) {
      this.dispatch(eventName.solutionFound);
    }
  };

  #addInteractivity = () => {
    this.addListener('cellmousedown', this.#handleCellMouseDown);
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
    this.#curSum = 0;
    this.#refSum = 0;
    this.#invalids.clear();
  }

  update(matrix) {
    this.#init();

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
    this.cells.forEach((itm) =>
      itm.valid ? itm.toggleHighlight(true) : itm.reset()
    );
  }
}
