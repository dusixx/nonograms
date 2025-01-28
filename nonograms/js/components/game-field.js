import {
  isArray,
  isFunc,
  isInt,
  isPositiveInt,
  checkArgument,
  JSONParse,
} from '../utils/index.js';

import { Element } from './base/element.js';
import { Cell } from './cell.js';
import { CluesHelper } from './clues-helper.js';
import { Clues } from './clues.js';
import { eventName, cellStateFlags } from '../../data/constants.js';
import { Cells } from './cells.js';

const cls = {
  gameField: 'game-field',
  cluesLeft: 'clues-left',
  cluesTop: 'clues-top',
};

const cssVar = {
  gameFieldRows: '--game-field-rows',
  gameFieldCols: '--game-field-cols',
};

//
//------------------
// GameField
//------------------
//

export class GameField extends Element {
  #cells;
  #cluesLeft;
  #cluesTop;

  constructor(mx) {
    super({ className: cls.gameField });

    this.#cluesTop = new Clues({ className: cls.cluesTop });
    this.#cluesLeft = new Clues({ className: cls.cluesLeft });
    this.#cells = new Cells();

    this.append(this.#cluesTop, this.#cluesLeft, this.#cells);
    this.#addInteractivity();
    this.update(mx);
  }

  #handleCellMouseEnter = ({ detail: { target: cell } }) => {
    const { row, col } = cell.position;
    this.#cluesLeft.highlight(row, true);
    this.#cluesTop.highlight(col, true);
  };

  #handleCellMouseLeave = ({ detail: { target: cell } }) => {
    const { row, col } = cell.position;
    this.#cluesLeft.highlight(row, false);
    this.#cluesTop.highlight(col, false);
  };

  #addInteractivity = () => {
    this.addListener(eventName.cellMouseEnter, this.#handleCellMouseEnter);
    this.addListener(eventName.cellMouseLeave, this.#handleCellMouseLeave);
  };

  #updateCSSVariables = (mx) => {
    const { style } = this.ref;
    style.setProperty(cssVar.gameFieldRows, mx.length);
    style.setProperty(cssVar.gameFieldCols, mx[0]?.length ?? 0);
  };

  update(mx) {
    if (!isArray(mx)) {
      return;
    }
    this.#updateCSSVariables(mx);
    const cluesHelper = new CluesHelper(mx);

    this.#cells.update(mx, (cell) => {
      // build clues matrices
      cluesHelper.push(cell);
    });
    // create clues
    const { top, left } = cluesHelper.getClues();
    this.#cluesTop.update(top);
    this.#cluesLeft.update(left);
  }

  reset() {
    this.#cells.reset();
    this.#cluesLeft.reset();
    this.#cluesTop.reset();
  }

  // createSnapshot(stringify = true) {
  //   const snapshot = this.cells.reduce(
  //     (res, cell) => {
  //       const {
  //         selected,
  //         discarded,
  //         position: { row, col },
  //       } = cell;

  //       if (selected) {
  //         res.selected.push([row, col]);
  //       } else if (discarded) {
  //         res.discarded.push([row, col]);
  //       }
  //       return res;
  //     },
  //     {
  //       selected: [],
  //       discarded: [],
  //       cluesLeft: this.#cluesLeftRef.createSnapshot(),
  //       cluesTop: this.#cluesTopRef.createSnapshot(),
  //     }
  //   );

  //   return stringify ? JSON.stringify(snapshot) : snapshot;
  // }

  // restoreBySnapshot(snapshot) {
  //   const { selected, discarded, cluesTop, cluesLeft } =
  //     JSONParse(snapshot) ?? '';

  //   // clues
  //   this.#cluesTopRef.restoreBySnapshot(cluesTop);
  //   this.#cluesLeftRef.restoreBySnapshot(cluesLeft);

  //   // selected cells
  //   selected.forEach(([row, col]) => {
  //     this.#cellsRef.children[row].children[col].selected = true;
  //   });
  //   // discarded cells
  //   discarded.forEach(([row, col]) => {
  //     this.#cellsRef.children[row].children[col].discarded = true;
  //   });
  // }
}
