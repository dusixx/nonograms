import { CellStateFlags, ClassName } from '../../common/constants/index.js';
import { isPositiveInt } from '../../common/utils.js';
import { Element } from '../base/element.js';

export class Cell extends Element {
  #value = CellStateFlags.Invalid;
  #position; // {row, col}

  constructor(props, ...children) {
    super(props, ...children);
    this.toggleClass(ClassName.Cell, true);
  }

  get [Symbol.toStringTag]() {
    return 'Cell';
  }

  toggleSelect(force) {
    const selected = this.toggleClass(ClassName.CellSelected, force);
    if (selected) {
      this.#value |= CellStateFlags.Selected;
      this.toggleDiscard(false);
    } else {
      this.#value &= ~CellStateFlags.Selected;
    }
  }

  toggleDiscard(force) {
    const discarded = this.toggleClass(ClassName.CellDiscarded, force);
    if (discarded) {
      this.#value |= CellStateFlags.Discarded;
      this.toggleSelect(false);
    } else {
      this.#value &= ~CellStateFlags.Discarded;
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
    this.isSelected = v & CellStateFlags.Selected;
    this.isDiscarded = v & CellStateFlags.Discarded;
    this.#value = v;
  }

  get isSelected() {
    return !!(this.value & CellStateFlags.Selected);
  }

  set isSelected(v) {
    this.toggleSelect(!!v);
  }

  get isDiscarded() {
    return !!(this.value & CellStateFlags.Discarded);
  }

  set isDiscarded(v) {
    this.toggleDiscard(!!v);
  }

  get isValid() {
    return !!(this.value & CellStateFlags.Valid);
  }
}
