import { ClassName, isPositiveInt } from '@common';
import { Element } from '@components';

export class Clue extends Element {
  #position;
  #discarded;

  constructor(props, ...children) {
    super(props, ...children);
    this.toggleClass(ClassName.Clue, true);
  }

  toggleDiscard(force) {
    this.#discarded = this.toggleClass(ClassName.ClueDiscarded, force);
  }

  get isDiscarded() {
    return !!this.#discarded;
  }

  set isDiscarded(v) {
    this.toggleDiscard(!!v);
  }

  set position({ row, col }) {
    if (isPositiveInt(row) && isPositiveInt(col)) {
      this.#position = { row, col };
    }
  }

  get position() {
    return this.#position;
  }
}
