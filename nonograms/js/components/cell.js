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
    this.addListener('contextmenu', (e) => {
      e.preventDefault();
    });
    this.addListener('mousedown', this.#handleMouseDown);
  };

  toggleHighlight() {
    this.#highlighted = this.toggleClass(cls.highlighted);
    if (this.#highlighted) {
      this.toggleClass(cls.discarded, false);
    }
  }

  toggleDiscard() {
    this.#discarded = this.toggleClass(cls.discarded);
    if (this.#discarded) {
      this.toggleClass(cls.highlighted, false);
    }
  }

  get highlighted() {
    return this.#highlighted;
  }

  get discarded() {
    return this.#discarded;
  }
}
