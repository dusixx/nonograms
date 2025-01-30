import { Cell, cls as cellCls } from './cell.js';
import { Element } from './base/element.js';
import { isMatrix } from '../utils/helpers.js';
import { eventName, cellStateFlags, mouseBtn } from '../../data/constants.js';
import { CluesHelper } from './clues-helper.js';

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
  #pressedMouseBtn = -1;
  #eraserMode;
  #reviewerMode;
  // to avoid blind spots when hovering over cells row
  #mouseOverCell;

  constructor(mx, callback) {
    super({ className: cls.cells });

    this.update(mx);
    this.#addInteractivity();
  }

  #getCellByRef = (ref) => {
    return this.#cellsMap.has(ref) ? this.#cellsMap.get(ref) : null;
  };

  #checkIfSolved = () => {
    const wasSolved =
      this.#selectedValid.size === this.#numOfValid &&
      this.#selectedInvalid.size === 0;
    if (wasSolved) {
      this.dispatchCustom(eventName.solutionFound);
    }
  };

  #addSelectedCellToDesiredSet = (cell) => {
    const targetSet = cell.isValid
      ? this.#selectedValid
      : this.#selectedInvalid;

    const action = cell.isSelected ? 'add' : 'delete';
    targetSet[action](cell);
  };

  #handleMouseDown = (e) => {
    const { button: btn, target } = e;

    const cell =
      this.#getCellByRef(target.closest(`.${cls.cell}`)) ?? this.#mouseOverCell;
    if (!cell) {
      return;
    }
    this.#pressedMouseBtn = btn;
    this.#eraserMode =
      (cell.isSelected && btn === mouseBtn.left) ||
      (cell.isDiscarded && btn === mouseBtn.right);

    if (btn === mouseBtn.left) {
      cell.toggleSelect();
    } else if (btn === mouseBtn.right) {
      cell.toggleDiscard();
    }
    this.#addSelectedCellToDesiredSet(cell);
    this.#checkIfSolved();
  };

  #handleMouseUp = () => {
    this.#pressedMouseBtn = -1;
    this.#eraserMode = false;
  };

  #handleMouseOver = ({ target }) => {
    const cell =
      this.#getCellByRef(target.closest(`.${cls.cell}`)) ?? this.#mouseOverCell;
    if (!cell) {
      return;
    }
    this.#mouseOverCell = cell;
    cell.dispatchCustom(eventName.cellMouseOver);

    if (this.#eraserMode) {
      cell.toggleSelect(false);
      cell.toggleDiscard(false);
    } else if (this.#pressedMouseBtn === mouseBtn.left) {
      cell.toggleSelect(true);
    } else if (this.#pressedMouseBtn === mouseBtn.right) {
      cell.toggleDiscard(true);
    } else {
      return;
    }
    this.#addSelectedCellToDesiredSet(cell);
    this.#checkIfSolved();
  };

  #handleMouseOut = ({ target }) => {
    const cell =
      this.#getCellByRef(target.closest(`.${cls.cell}`)) ?? this.#mouseOverCell;
    if (!cell) {
      return;
    }
    cell.dispatchCustom(eventName.cellMouseOut);
  };

  // fired after mouseup
  #handleContextMenu = (e) => {
    // not long tap
    if (e.button !== -1) {
      return;
    }
    const cell = this.#getCellByRef(e.target.closest(`.${cls.cell}`));
    if (!cell) {
      return;
    }
    cell.toggleDiscard();
  };

  #addInteractivity = () => {
    this.addListener('mousedown', this.#handleMouseDown);
    this.addListener('mouseup', this.#handleMouseUp);
    this.addListener('mouseover', this.#handleMouseOver);
    this.addListener('mouseout', this.#handleMouseOut);
    this.addListener('contextmenu', this.#handleContextMenu);
  };

  // div.cells > div.cells__row*mxSize > div.cell*mxSize
  #appendCells = (mx) => {
    if (!isMatrix(mx)) {
      return;
    }
    const cluesHelper = new CluesHelper(mx);

    // [ div.cells__row > div.cell,... ]
    const allRows = mx.map((valuesRow, row) => {
      const cellsRow = new Element({ className: cls.cellsRow });

      const items = valuesRow.map((value, col) => {
        const cell = new Cell();

        cell.position = { row, col };
        cell.value = value;
        this.#cellsMap.set(cell.ref, cell);

        if (cell.isValid) {
          this.#numOfValid += 1;
        }
        this.#addSelectedCellToDesiredSet(cell);
        cluesHelper.push(cell);

        return cell;
      });
      cellsRow.append(...items);

      return cellsRow;
    });
    this.append(...allRows);
    this.#checkIfSolved();

    return cluesHelper.getClues();
  };

  update(mx) {
    if (!isMatrix(mx)) {
      return;
    }
    this.#numOfValid = 0;
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();
    this.#cellsMap.clear();

    this.removeChildren();

    return this.#appendCells(mx);
  }

  get values() {
    return [...this.#cellsMap.values()];
  }

  reset() {
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();
    this.values.forEach((cell) => cell.reset());
  }

  revealSolution() {
    this.reset();
    this.values.forEach((cell) =>
      cell.isValid ? cell.toggleSelect(true) : cell.toggleDiscard(true)
    );
  }

  toggleReviewerMode(force) {
    this.#reviewerMode = force != null ? !!force : !this.#reviewerMode;

    this.values.forEach((cell) => {
      cell.ref.style.backgroundColor =
        cell.isValid && this.#reviewerMode
          ? 'var(--color-reviewer-mode)'
          : null;
    });
    return this.#reviewerMode;
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
