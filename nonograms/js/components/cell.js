import { isPositiveInt } from '../utils/helpers.js';
import { Element } from './base/element.js';

const mouseBtn = {
  left: 0,
  middle: 1,
  right: 2,
};

const CLS_CELL = 'cell';
const cls = {
  cell: CLS_CELL,
  selected: `${CLS_CELL}--selected`,
  discarded: `${CLS_CELL}--discarded`,
};

const eventName = {
  cellMouseDown: 'cellmousedown',
};

//
//------------------
// Cell
//------------------
//

export class Cell extends Element {
  #valid;
  #position; //{row, col}
  #selected = false;
  #discarded = false;

  constructor(props, ...children) {
    super(props, ...children);
    // add cell base class
    this.toggleClass(cls.cell, true);
    this.#addInteractivity();
  }

  get [Symbol.toStringTag]() {
    return 'Cell';
  }

  #handleMouseDown = (e) => {
    if (e.button === mouseBtn.left) {
      this.toggleSelect();
    } else if (e.button === mouseBtn.right) {
      this.toggleDiscard();
    }
    this.dispatch(eventName.cellMouseDown);
  };

  #addInteractivity = () => {
    // disable RMB context menu
    this.addListener('contextmenu', (e) => e.preventDefault());
    this.addListener('mousedown', this.#handleMouseDown);
  };

  toggleSelect(force) {
    this.#selected = this.toggleClass(cls.selected, force);
    if (this.#selected) {
      this.toggleDiscard(false);
    }
  }

  toggleDiscard(force) {
    this.#discarded = this.toggleClass(cls.discarded, force);
    if (this.#discarded) {
      this.toggleSelect(false);
    }
  }

  reset() {
    this.toggleDiscard(false);
    this.toggleSelect(false);
  }

  get selected() {
    return this.#selected;
  }

  get discarded() {
    return this.#discarded;
  }

  set selected(v) {
    this.toggleSelect(Boolean(v));
  }

  set discarded(v) {
    this.toggleDiscard(Boolean(v));
  }

  get position() {
    return this.#position;
  }

  set position({ row, col }) {
    if (isPositiveInt(row) && isPositiveInt(col)) {
      this.#position = { row, col };
    }
  }

  get valid() {
    return this.#valid;
  }

  set valid(v) {
    this.#valid = Boolean(v);
  }
}
