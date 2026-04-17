import { CSSVars, ClassName, EventName } from '../common/constants/index.js';
import { JSONParse, isMatrix } from '../common/utils.js';
import { Element } from './base/element.js';
import { Cells } from './cells/cells.js';
import { Clues } from './clues/clues.js';

export class GameField extends Element {
  #cells;
  #cluesLeft;
  #cluesTop;

  constructor(mx) {
    super({ className: ClassName.GameField });

    this.#cluesTop = new Clues({ className: ClassName.CluesTop });
    this.#cluesLeft = new Clues({ className: ClassName.CluesLeft });
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

  #handleCellChange = ({ detail: { target: cell } }) => {
    this.dispatchCustom(EventName.GameFieldHasChanged, { cell });
  };

  #handleClueChange = ({ detail: { target: clue } }) => {
    this.dispatchCustom(EventName.GameFieldHasChanged, { clue });
  };

  #addInteractivity = () => {
    this.addListener('contextmenu', (e) => e.preventDefault());
    this.addListener(EventName.CellMouseOver, this.#handleCellMouseOver);
    this.addListener(EventName.CellMouseOut, this.#handleCellMouseOut);
    this.addListener(EventName.CellHasChanged, this.#handleCellChange);
    this.addListener(EventName.ClueHasChanged, this.#handleClueChange);
  };

  update(mx) {
    if (!isMatrix(mx)) {
      return;
    }
    const { style } = document.body;
    style.setProperty(CSSVars.GameFieldRows, mx.length);
    style.setProperty(CSSVars.GameFieldCols, mx[0]?.length ?? 0);

    const { cluesTop, cluesLeft } = this.#cells.update(mx);
    this.#cluesTop.update(cluesTop);
    this.#cluesLeft.update(cluesLeft);
  }

  reset() {
    this.#cells.reset();
    this.#cluesLeft.reset();
    this.#cluesTop.reset();
  }

  revealSolution() {
    this.#cells.revealSolution();
    this.#cluesTop.discardAll();
    this.#cluesLeft.discardAll();
  }

  toggleReviewerMode(force) {
    return this.#cells.toggleReviewerMode(force);
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

    this.update(cells);
    this.#cluesTop.restoreBySnapshot(cluesTop);
    this.#cluesLeft.restoreBySnapshot(cluesLeft);
  }

  get hasSelectedOrDiscarded() {
    return this.#cells.hasSelectedOrDiscarded;
  }

  allowPointerEvents(flag) {
    if (!flag) {
      // prevent document context menu after discarding last invalid cell
      document.addEventListener('contextmenu', (e) => e.preventDefault(), {
        once: true,
      });
    }
    super.allowPointerEvents(flag);
  }
}
