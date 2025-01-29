import { isPositiveInt } from '../utils/helpers.js';
import { Element } from './base/element.js';
import { eventName, cellStateFlags, mouseBtn } from '../../data/constants.js';

export const cls = {
  cell: 'cell',
  selected: 'cell--selected',
  discarded: 'cell--discarded',
};

//
//------------------
// Cell
//------------------
//

export class Cell extends Element {
  #value = cellStateFlags.invalid;
  #position; //{row, col}

  constructor(props, ...children) {
    super(props, ...children);
    // add cell base class
    this.toggleClass(cls.cell, true);
  }

  get [Symbol.toStringTag]() {
    return 'Cell';
  }

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
