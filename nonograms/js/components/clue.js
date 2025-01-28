import { Element } from './base/element.js';
import { isPositiveInt } from '../utils/helpers.js';

export const cls = {
  clue: 'clue',
  discarded: 'clue--discarded',
};

export class Clue extends Element {
  #position;
  #discarded;

  constructor(props, ...children) {
    super(props, ...children);
    // add clue base class
    this.toggleClass(cls.clue, true);
  }

  toggleDiscard(force) {
    this.#discarded = this.toggleClass(cls.discarded, force);
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
