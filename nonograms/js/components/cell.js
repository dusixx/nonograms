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
  highlighted: `${CLS_CELL}--highlighted`,
  discarded: `${CLS_CELL}--discarded`,
};

//
//------------------
// Cell
//------------------
//

export class Cell extends Element {
  #highlighted;
  #discarded;
  #valid;
  #position; //{row, col}
  //#onDiscard;
  //#onHighlight;

  constructor(props, ...children) {
    super(props, ...children);
    // add cell base class
    this.toggleClass(cls.cell, true);
    this.#addInteractivity();
  }

  #handleMouseDown = (e) => {
    if (e.button === mouseBtn.left) {
      this.toggleHighlight();
    } else if (e.button === mouseBtn.right) {
      this.toggleDiscard();
    }
  };

  #addInteractivity = () => {
    // disable RMB context menu
    this.addListener('contextmenu', (e) => e.preventDefault());
    this.addListener('mousedown', this.#handleMouseDown);
  };

  toggleHighlight(force) {
    this.#highlighted = this.toggleClass(cls.highlighted, force);
    if (this.#highlighted) {
      //this.#onHighlight?.();
      //
      //TODO: for debugging only
      if (this.valid) {
        this.ref.style.backgroundColor = 'green';
      }
      //
      this.toggleClass(cls.discarded, false);
    }
  }

  toggleDiscard(force) {
    this.#discarded = this.toggleClass(cls.discarded, force);
    if (this.#discarded) {
      //this.#onDiscard?.();
      this.toggleClass(cls.highlighted, false);
    }
  }

  reset() {
    this.toggleDiscard(false);
    this.toggleHighlight(false);
  }

  get highlighted() {
    return this.#highlighted;
  }

  get discarded() {
    return this.#discarded;
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
