import { Cell, cls as cellCls } from './cell.js';
import { Element } from './base/element.js';
import { isMatrix } from '../utils/helpers.js';

import {
  eventName,
  cellStateFlags,
  mouseBtn,
  drawingMode,
} from '../../data/constants.js';

const cls = {
  cells: 'cells',
  cellsRow: 'cells__row',
  ...cellCls,
};

export class Cells extends Element {
  #numOfValid = 0;
  #selectedValid = new Set(); // Set<Cell>
  #selectedInvalid = new Set(); // Set<Cell>
  #cellsMap = new Map(); // Map<ref,Cell>
  #drawingMode;

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

  #addSelectedCellToDesiredSet = (cell) => {
    const targetSet = cell.isValid
      ? this.#selectedValid
      : this.#selectedInvalid;

    const action = cell.isSelected ? 'add' : 'delete';
    targetSet[action](cell);

    if (this.#wasSolved()) {
      this.dispatch(eventName.solutionFound);
    }
  };

  #changeDrawingModeOnMouseDown = (btn, cell) => {
    if (btn === mouseBtn.left) {
      this.#drawingMode = cell.isSelected
        ? drawingMode.erase
        : drawingMode.select;
    } else if (btn === mouseBtn.right) {
      this.#drawingMode = cell.isDiscarded
        ? drawingMode.erase
        : drawingMode.discard;
    }
  };

  #handleMouseDown = (e) => {
    const { button, target } = e;

    if (!e.target.closest(`.${cls.cell}`)) {
      return;
    }
    const cell = this.#getCellByRef(target);

    this.#changeDrawingModeOnMouseDown(button, cell);

    if (this.#drawingMode === drawingMode.select) {
      cell.toggleSelect();
    } else if (drawingMode === drawingMode.discard) {
      cell.toggleDiscard();
    }
    this.#addSelectedCellToDesiredSet(cell);
  };

  #handleMouseUp = () => {
    this.#drawingMode = drawingMode.none;
  };

  #handleMouseOver = (e) => {
    if (!e.target.closest(`.${cls.cell}`)) {
      return;
    }
    const cell = this.#getCellByRef(e.target);

    cell.dispatch(eventName.cellMouseOver);

    if (this.#drawingMode === drawingMode.erase) {
      cell.toggleSelect(false).toggleDiscard(false);
    } else if (this.#drawingMode === drawingMode.select) {
      cell.toggleSelect(true);
    } else if (this.#drawingMode === drawingMode.discard) {
      cell.toggleDiscard(true);
    }

    if (this.#drawingMode !== drawingMode.none) {
      this.#addSelectedCellToDesiredSet(cell);
    }
  };

  #handleMouseOut = (e) => {
    if (!e.target.closest(`.${cls.cell}`)) {
      return;
    }
    const cell = this.#getCellByRef(e.target);
    cell.dispatch(eventName.cellMouseOut);
  };

  #addInteractivity = () => {
    this.addListener('mousedown', this.#handleMouseDown);
    this.addListener('mouseup', this.#handleMouseUp);
    this.addListener('mouseover', this.#handleMouseOver);
    this.addListener('mouseout', this.#handleMouseOut);
  };

  // div.cells > div.cells__row*mxSize > div.cell*mxSize
  #appendCells = (mx, callback) => {
    if (!isMatrix(mx)) {
      return;
    }
    // [ div.cells__row > div.cell,... ]
    const allRows = mx.map((valuesRow, row) => {
      const cellsRow = new Element({ className: cls.cellsRow });

      const items = valuesRow.map((value, col) => {
        const cell = new Cell();
        cell.position = { row, col };
        cell.value = value;

        this.#cellsMap.set(cell.ref, cell);

        if (cell.isValid) {
          cell.ref.style.backgroundColor = '#ddd';
          this.#numOfValid += 1;
        }
        this.#addSelectedCellToDesiredSet(cell);
        callback?.(cell);

        return cell;
      });
      cellsRow.append(...items);

      return cellsRow;
    });

    this.append(...allRows);
  };

  update(mx, callback) {
    if (!isMatrix(mx)) {
      return;
    }
    this.#numOfValid = 0;
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();
    this.#cellsMap.clear();

    this.removeChildren();
    this.#appendCells(mx, callback);
  }

  #enumCells = (callback) => {
    this.children.forEach((cellsRow) => {
      cellsRow.children.forEach(callback);
    });
  };

  reset() {
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();
    this.#enumCells((cell) => cell.reset());
  }

  revealSolution() {
    this.reset();
    this.#enumCells((cell) =>
      cell.isValid ? cell.toggleSelect(true) : cell.reset()
    );
  }

  getSnapshot() {
    return this.children.map((cellsRow) => {
      return cellsRow.children.map(({ value }) => value);
    });
  }

  restoreBySnapshot(snapshot) {
    this.update(snapshot);
  }
}
