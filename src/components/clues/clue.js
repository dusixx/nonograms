import { ClassName } from '../../common/constants/index.js';
import { isPositiveInt } from '../../common/utils.js';
import { Element } from '../base/element.js';

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
