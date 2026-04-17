import { isMatrix } from '../../common/utils.js';
import { Element } from '../base/index.js';
import { CluesHelper } from '../clues/clues-helper.js';

import {
  ClassName,
  EventName,
  MouseButton,
} from '../../common/constants/index.js';
import { Cell } from './cell.js';

export class Cells extends Element {
  #started;
  #numOfValid = 0;
  #selectedValid = new Set(); // Set<Cell>
  #selectedInvalid = new Set(); // Set<Cell>
  #selected = new Set(); // Set<Cell>
  #discarded = new Set(); // Set<Cell>
  #cellsMap = new Map(); // Map<ref,Cell>
  #pressedMouseBtn = -1;
  #eraserMode;
  #reviewerMode;
  // to avoid blind spots when hovering over cell row border
  #mouseOverCell;

  constructor(mx) {
    super({ className: ClassName.Cells });

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
      // to avoid any side effect
      this.#handleMouseUp();
      this.dispatchCustom(EventName.SolutionFound);
    }
  };

  #addCellToDesiredSet = (cell) => {
    if (cell.isSelected) {
      this.#selected.add(cell);
      this.#discarded.delete(cell);
      return;
    }
    if (cell.isDiscarded) {
      this.#discarded.add(cell);
      this.#selected.delete(cell);
      return;
    }
    this.#discarded.delete(cell);
    this.#selected.delete(cell);
  };

  #addSelectedCellToDesiredSet = (cell) => {
    const targetSet = cell.isValid
      ? this.#selectedValid
      : this.#selectedInvalid;

    const action = cell.isSelected ? 'add' : 'delete';
    targetSet[action](cell);

    this.#addCellToDesiredSet(cell);
  };

  #handleMouseDown = (e) => {
    const { button: btn, target } = e;

    const cell =
      this.#getCellByRef(target.closest(`.${ClassName.Cell}`)) ??
      this.#mouseOverCell;
    if (!cell) {
      return;
    }
    // game started
    if (!this.#started) {
      this.#started = true;
      cell.dispatchCustom(EventName.CellsChangedForTheFirstTime);
    }

    this.#pressedMouseBtn = btn;
    this.#eraserMode =
      (cell.isSelected && btn === MouseButton.Left) ||
      (cell.isDiscarded && btn === MouseButton.Right);

    if (btn === MouseButton.Left) {
      cell.toggleSelect();
    } else if (btn === MouseButton.Right) {
      cell.toggleDiscard();
    }
    this.#addSelectedCellToDesiredSet(cell);
    cell.dispatchCustom(EventName.CellHasChanged);
    this.#checkIfSolved();
  };

  #handleMouseUp = () => {
    this.#pressedMouseBtn = -1;
    this.#eraserMode = false;
  };

  #handleMouseOver = ({ target }) => {
    const cell =
      this.#getCellByRef(target.closest(`.${ClassName.Cell}`)) ??
      this.#mouseOverCell;
    if (!cell) {
      return;
    }
    const { isDiscarded, isSelected } = cell;
    this.#mouseOverCell = cell;
    cell.dispatchCustom(EventName.CellMouseOver);

    if (this.#eraserMode) {
      cell.toggleSelect(false);
      cell.toggleDiscard(false);
    } else if (this.#pressedMouseBtn === MouseButton.Left) {
      cell.toggleSelect(true);
    } else if (this.#pressedMouseBtn === MouseButton.Right) {
      cell.toggleDiscard(true);
    } else {
      return;
    }
    // cell was not actualy changed
    if (cell.isDiscarded === isDiscarded && cell.isSelected === isSelected) {
      return;
    }
    this.#addSelectedCellToDesiredSet(cell);
    cell.dispatchCustom(EventName.CellHasChanged);
    this.#checkIfSolved();
  };

  #handleMouseOut = ({ target }) => {
    const cell =
      this.#getCellByRef(target.closest(`.${ClassName.Cell}`)) ??
      this.#mouseOverCell;
    if (!cell) {
      return;
    }
    cell.dispatchCustom(EventName.CellMouseOut);
  };

  // fired after mouseup
  #handleContextMenu = (e) => {
    // not long tap
    if (e.button !== -1) {
      return;
    }
    const cell = this.#getCellByRef(e.target.closest(`.${ClassName.Cell}`));
    if (!cell) {
      return;
    }
    cell.toggleDiscard();
    cell.dispatchCustom(EventName.CellHasChanged);
  };

  #addInteractivity = () => {
    this.addListener('mousedown', this.#handleMouseDown);
    this.addListener('mouseup', this.#handleMouseUp);
    this.addListener('mouseover', this.#handleMouseOver);
    this.addListener('mouseout', this.#handleMouseOut);
    this.addListener('contextmenu', this.#handleContextMenu);
    document.addEventListener('mouseup', this.#handleMouseUp);
  };

  #appendCells = (mx) => {
    if (!isMatrix(mx)) {
      return;
    }
    const cluesHelper = new CluesHelper(mx);

    const allRows = mx.map((valuesRow, row) => {
      const cellsRow = new Element({ className: ClassName.CellsRow });

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

  #init() {
    this.#started = false;
    this.#selectedValid.clear();
    this.#selectedInvalid.clear();
    this.#selected.clear();
    this.#discarded.clear();
  }

  update(mx) {
    if (!isMatrix(mx)) {
      return;
    }
    this.#init();
    this.#numOfValid = 0;
    this.#cellsMap.clear();

    this.removeChildren();

    return this.#appendCells(mx);
  }

  get values() {
    return [...this.#cellsMap.values()];
  }

  reset() {
    this.#init();
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

  get selectedCount() {
    return this.#selected.size;
  }

  get discardedCount() {
    return this.#discarded.size;
  }

  get hasSelectedOrDiscarded() {
    return this.selectedCount || this.discardedCount;
  }

  getSnapshot() {
    return this.children.map((cellsRow) => {
      return cellsRow.children.map(({ value }) => value);
    });
  }
}
