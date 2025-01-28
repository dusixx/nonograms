import { Cell } from './cell.js';
import { Element } from './base/element.js';
import { isArray } from '../utils/helpers.js';
import { eventName, cellStateFlags } from '../../data/constants.js';

const cls = {
  cells: 'cells',
  cellsRow: 'cells__row',
};

export class Cells extends Element {
  #snapshot;
  #numOfValid = 0;
  #cellsMap = new Map(); //{ref, instance}
  #selectedValid = new Set(); //instances
  #selectedInvalid = new Set(); //instances

  constructor(mx, callback) {
    super({ className: cls.cells });

    this.update(mx, callback);
    this.#addInteractivity();
  }

  #getCellByRef = (ref) => {
    return this.#cellsMap.has(ref) ? this.#cellsMap.get(ref) : null;
  };

  #wasSolved = () => {
    return (
      this.#selectedValid.size === this.#numOfValid &&
      this.#selectedInvalid.size === 0
    );
  };

  #handleCellMouseDown = ({ detail: { target: cell } }) => {
    const targetSet = cell.isValid
      ? this.#selectedValid
      : this.#selectedInvalid;

    const action = cell.isSelected ? 'add' : 'delete';

    targetSet[action](cell);

    // update cells snapshot
    const { row, col } = cell.position;
    this.#snapshot[row][col] = cell.value;

    console.log(this.#snapshot);

    if (this.#wasSolved()) {
      this.dispatch(eventName.solutionFound);
    }
  };

  #addInteractivity = () => {
    this.addListener(eventName.cellMouseDown, this.#handleCellMouseDown);
  };

  // div.cells > div.cells__row*mxSize > div.cell*mxSize
  #appendCells = (mx, callback) => {
    if (!isArray(mx)) {
      return;
    }
    // [ div.cells__row > div.cell,... ]
    const allRows = mx.map((row, rowIdx) => {
      const cellsRow = new Element({ className: cls.cellsRow });

      const items = row.map((value, colIdx) => {
        const cell = new Cell();
        cell.position = { row: rowIdx, col: colIdx };
        cell.value = value;

        callback?.(cell);

        this.#cellsMap.set(cell.ref, cell);
        this.#snapshot[rowIdx][colIdx] = value;

        if (cell.isValid) {
          // TODO: ...
          cell.ref.style.backgroundColor = '#ddd';
          this.#numOfValid += 1;
        }
        return cell;
      });
      cellsRow.append(...items);

      return cellsRow;
    });

    this.append(...allRows);
  };

  update(mx, callback) {
    if (!isArray(mx)) {
      return;
    }
    this.#snapshot = [...mx];
    this.#cellsMap.clear();
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();

    this.removeChildren();
    this.#appendCells(mx, callback);
  }

  #resetSnapshot = () => {
    this.#snapshot = this.#snapshot.map((rows) => {
      return rows.map((value) =>
        value & cellStateFlags.valid
          ? cellStateFlags.valid
          : cellStateFlags.invalid
      );
    });
  };

  getSnapshot() {
    return this.#snapshot;
  }

  reset() {
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();
    this.#resetSnapshot();
    this.values.forEach((itm) => itm.reset());
  }

  revealSolution() {
    this.reset();
    this.values.forEach((itm) =>
      itm.isValid ? itm.toggleSelect(true) : itm.reset()
    );
  }

  get values() {
    return [...this.#cellsMap.values()];
  }
}
