import {
  isArray,
  isFunc,
  isInt,
  isPositiveInt,
  checkArgument,
  JSONParse,
} from '../utils/index.js';

import { Element } from './base/element.js';
import { Cell } from './cell.js';
import { CluesHelper } from './clues-helper.js';
import { Clues } from './clues.js';

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
  cellMouseEnter: 'cellmouseenter',
  cellMouseLeave: 'cellmouseleave',
};

const cellState = {
  invalid: 0,
  valid: 1,
  selected: 2,
  discarded: 3,
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
  #cluesLeftRef;
  #cluesTopRef;
  #snapshot;
  #validCount = 0;
  #started = false;
  #cellsMap = new Map(); //{ref, instance}
  #valid = new Set(); //instances
  #invalid = new Set(); //instances

  constructor(matrix) {
    const cluesTop = new Clues({ className: cls.cluesTop });
    const cluesLeft = new Clues({ className: cls.cluesLeft });
    const cells = new Element({ className: cls.cells });

    super({ className: cls.gameField }, cluesTop, cluesLeft, cells);

    this.#cellsRef = cells;
    this.#cluesTopRef = cluesTop;
    this.#cluesLeftRef = cluesLeft;

    this.#addInteractivity();
    this.update(matrix);
  }

  #getCellByRef = (ref) => {
    return this.#cellsMap.has(ref) ? this.#cellsMap.get(ref) : null;
  };

  #wasSolved = () => {
    return this.#valid.size === this.#validCount && this.#invalid.size === 0;
  };

  // #updateSnapshot = (cell) => {
  //       const { row, col } = cell;
  //   this.#snapshot[row][col] |= ;
  // };

  #handleCellMouseDown = ({ detail: { target: cell } }) => {
    const targetSet = cell.valid ? this.#valid : this.#invalid;
    const action = cell.selected ? 'add' : 'delete';

    targetSet[action](cell);

    if (this.#wasSolved()) {
      this.allowPointerEvents(false);
      this.dispatch(eventName.solutionFound);
    }
  };

  #handleCellMouseEnter = ({ detail: { target: cell } }) => {
    const { row, col } = cell.position;
    this.#cluesLeftRef.highlight(row, true);
    this.#cluesTopRef.highlight(col, true);
  };

  #handleCellMouseLeave = ({ detail: { target: cell } }) => {
    const { row, col } = cell.position;
    this.#cluesLeftRef.highlight(row, false);
    this.#cluesTopRef.highlight(col, false);
  };

  #addInteractivity = () => {
    this.addListener(eventName.cellMouseDown, this.#handleCellMouseDown);
    this.addListener(eventName.cellMouseEnter, this.#handleCellMouseEnter);
    this.addListener(eventName.cellMouseLeave, this.#handleCellMouseLeave);
  };

  #updateCSSVariables = (mx) => {
    const { style } = this.ref;
    style.setProperty(cssVar.gameFieldRows, mx.length);
    style.setProperty(cssVar.gameFieldCols, mx[0]?.length ?? 0);
  };

  #createCells = (mx) => {
    if (!isArray(mx)) {
      return;
    }
    this.#updateCSSVariables(mx);
    const cluesHelper = new CluesHelper(mx);

    this.#snapshot = [...mx];

    // [ div.cells__row > div.cell,... ]
    const allRows = mx.map((row, rowIdx) => {
      const cellsRow = new Element({ className: cls.cellsRow });

      const items = row.map((value, colIdx) => {
        const cell = new Cell();

        this.#cellsMap.set(cell.ref, cell);
        cell.position = { row: rowIdx, col: colIdx };

        cell.valid = cellState.valid & value;
        this.#snapshot[rowIdx][colIdx] = cellState.valid & value;

        if (cell.valid) {
          cell.ref.style.backgroundColor = '#ddd';
          cluesHelper.push(cell);
          this.#validCount += 1;
        }
        return cell;
      });
      cellsRow.append(...items);

      return cellsRow;
    });
    // create clues
    const { top, left } = cluesHelper.getClues();
    this.#cluesTopRef.update(top);
    this.#cluesLeftRef.update(left);

    return allRows;
  };

  #init() {
    this.#started = false;
    this.#invalid.clear();
    this.#valid.clear();
    this.allowPointerEvents(true);
  }

  update(mx) {
    if (!isArray(mx)) {
      return;
    }
    this.#init();
    this.#validCount = 0;
    this.#cellsMap.clear();

    this.#cluesLeftRef.removeChildren();
    this.#cluesTopRef.removeChildren();

    // div.cells > div.cells__row*mxSize > div.cell*mxSize
    this.#cellsRef.removeChildren();
    this.#cellsRef.append(...this.#createCells(mx));
  }

  get cells() {
    return [...this.#cellsMap.values()];
  }

  reset() {
    this.#init();
    this.#cluesLeftRef.reset();
    this.#cluesTopRef.reset();
    this.cells.forEach((itm) => itm.reset());
  }

  revealSolution() {
    this.reset();
    this.allowPointerEvents(false);

    this.cells.forEach((itm) =>
      itm.valid ? itm.toggleSelect(true) : itm.reset()
    );
  }

  createSnapshot(stringify = true) {
    const snapshot = this.cells.reduce(
      (res, cell) => {
        const {
          selected,
          discarded,
          position: { row, col },
        } = cell;

        if (selected) {
          res.selected.push([row, col]);
        } else if (discarded) {
          res.discarded.push([row, col]);
        }
        return res;
      },
      {
        selected: [],
        discarded: [],
        cluesLeft: this.#cluesLeftRef.createSnapshot(),
        cluesTop: this.#cluesTopRef.createSnapshot(),
      }
    );

    return stringify ? JSON.stringify(snapshot) : snapshot;
  }

  restoreBySnapshot(snapshot) {
    const { selected, discarded, cluesTop, cluesLeft } =
      JSONParse(snapshot) ?? '';

    // clues
    this.#cluesTopRef.restoreBySnapshot(cluesTop);
    this.#cluesLeftRef.restoreBySnapshot(cluesLeft);

    // selected cells
    selected.forEach(([row, col]) => {
      this.#cellsRef.children[row].children[col].selected = true;
    });
    // discarded cells
    discarded.forEach(([row, col]) => {
      this.#cellsRef.children[row].children[col].discarded = true;
    });
  }
}
