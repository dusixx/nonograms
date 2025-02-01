import { checkArgument, isMatrix } from '../utils/helpers.js';
import { cellStateFlags } from '../constants/index.js';

const isValid = (v) => v & cellStateFlags.valid;

export class CluesHelper {
  #mx;
  #top;
  #left;

  constructor(mx) {
    checkArgument(mx, 'Matrix', isMatrix);

    const rowsCount = mx.length;
    const colsCount = mx[0]?.length ?? 0;

    this.#mx = mx;
    // create clues matrices
    this.#left = Array.from({ length: rowsCount }, (_) => []);
    this.#top = Array.from({ length: colsCount }, (_) => []);
  }

  getClues() {
    return {
      cluesTop: [...this.#top],
      cluesLeft: [...this.#left],
    };
  }

  push(cell) {
    checkArgument(cell, 'Cell');

    if (!cell.isValid) {
      return;
    }
    const { row: curRow, col: curCol } = cell.position;
    const mx = this.#mx;
    const top = this.#top;
    const left = this.#left;

    // top
    let curColTopCluesIdx = top[curCol].length - 1;
    // the cell above the current is invalid
    if (!isValid(mx[curRow - 1]?.[curCol])) {
      // (-1) -> 0
      curColTopCluesIdx += 1;
    }
    const curColTopCluesCount = top[curCol][curColTopCluesIdx] ?? 0;
    top[curCol][curColTopCluesIdx] = curColTopCluesCount + 1;

    // left
    let curRowLeftCluesIdx = left[curRow].length - 1;
    // the cell before the current is invalid
    if (!isValid(mx[curRow][curCol - 1])) {
      curRowLeftCluesIdx += 1;
    }
    const curRowLeftCluesCount = left[curRow][curRowLeftCluesIdx] ?? 0;
    left[curRow][curRowLeftCluesIdx] = curRowLeftCluesCount + 1;
  }
}
