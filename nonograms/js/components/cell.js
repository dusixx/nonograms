import { isPositiveInt } from '../utils/helpers.js';
import { Element } from './base/element.js';

const mouseBtn = {
  left: 0,
  middle: 1,
  right: 2,
};

const cls = {
  cell: 'cell',
  selected: 'cell--selected',
  discarded: 'cell--discarded',
};

const eventName = {
  cellMouseDown: 'cellmousedown',
  cellMouseEnter: 'cellmouseenter',
  cellMouseLeave: 'cellmouseleave',
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
  #pressedMouseBtn;

  constructor(props, ...children) {
    super(props, ...children);
    // add cell base class
    this.toggleClass(cls.cell, true);
    this.#addInteractivity();
  }

  get [Symbol.toStringTag]() {
    return 'Cell';
  }

  #handleMouseDown = (e, btn, force) => {
    const button = btn ?? e?.button;

    if (button === mouseBtn.left) {
      this.toggleSelect(force);
    } else if (button === mouseBtn.right) {
      this.toggleDiscard(force);
    }
    this.dispatch(eventName.cellMouseDown);
  };

  #handleMouseEnter = (e) => {
    this.#handleMouseDown(null, this.#pressedMouseBtn, true);
    this.dispatch(eventName.cellMouseEnter);
  };

  #handleMouseLeave = (e) => {
    this.dispatch(eventName.cellMouseLeave);
  };

  #handleDocumentMouseDown = (e) => {
    this.#pressedMouseBtn = e.button;
  };

  #handleDocumentMouseUp = () => {
    this.#pressedMouseBtn = null;
  };

  #handleContextMenu = (e) => {
    e.preventDefault();
  };

  #addInteractivity = () => {
    document.addEventListener('mousedown', this.#handleDocumentMouseDown);
    document.addEventListener('mouseup', this.#handleDocumentMouseUp);
    // disable RMB context menu
    this.addListener('contextmenu', this.#handleContextMenu);
    this.addListener('mousedown', this.#handleMouseDown);
    this.addListener('mouseenter', this.#handleMouseEnter);
    this.addListener('mouseleave', this.#handleMouseLeave);
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
