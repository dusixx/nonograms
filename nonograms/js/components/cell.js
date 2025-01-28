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

export const cellStateFlags = {
  invalid: 0,
  valid: 1,
  selected: 2,
  discarded: 4,
};

//
//------------------
// Cell
//------------------
//

export class Cell extends Element {
  #value = cellStateFlags.invalid;
  #position; //{row, col}
  #pressedMouseBtn;
  #eraserMode = false;

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
    if (this.#pressedMouseBtn != null) {
      this.#handleMouseDown(null, this.#pressedMouseBtn, this.#eraserMode);
    }
    this.dispatch(eventName.cellMouseEnter);
  };

  #handleMouseLeave = (e) => {
    this.dispatch(eventName.cellMouseLeave);
  };

  #handleDocumentMouseDown = (e) => {
    this.#pressedMouseBtn = e.button;
    this.#eraserMode = !this.#eraserMode;
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
    const selected = this.toggleClass(cls.selected, force);
    if (selected) {
      this.#value |= cellStateFlags.selected;
      this.toggleDiscard(false);
    } else {
      this.#value &= ~cellStateFlags.selected;
    }
  }

  toggleDiscard(force) {
    const discarded = this.toggleClass(cls.discarded, force);
    if (discarded) {
      this.#value |= cellStateFlags.discarded;
      this.toggleSelect(false);
    } else {
      this.#value &= ~cellStateFlags.discarded;
    }
  }

  reset() {
    this.toggleDiscard(false);
    this.toggleSelect(false);
  }

  get position() {
    return this.#position;
  }

  set position({ row, col }) {
    if (isPositiveInt(row) && isPositiveInt(col)) {
      this.#position = { row, col };
    }
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    if (!isPositiveInt(v)) {
      return;
    }
    this.isSelected = v & cellStateFlags.selected;
    this.isDiscarded = v & cellStateFlags.discarded;
    this.#value = v;
  }

  get isSelected() {
    return !!(this.value & cellStateFlags.selected);
  }

  set isSelected(v) {
    this.toggleSelect(!!v);
  }

  get isDiscarded() {
    return !!(this.value & cellStateFlags.discarded);
  }

  set isDiscarded(v) {
    this.toggleDiscard(!!v);
  }

  get isValid() {
    return !!(this.value & cellStateFlags.valid);
  }
}
