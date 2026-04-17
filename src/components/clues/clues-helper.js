import { CellStateFlags } from '../../common/constants/index.js';
import { checkArgument, isMatrix } from '../../common/utils.js';

const isValid = (v) => v & CellStateFlags.Valid;

export class CluesHelper {
  #mx;
  #top;
  #left;

  constructor(mx) {
    checkArgument(mx, 'Matrix', isMatrix);

    const rowsCount = mx.length;
    const colsCount = mx[0]?.length ?? 0;

    this.#mx = mx;
    this.#left = Array.from({ length: rowsCount }, () => []);
    this.#top = Array.from({ length: colsCount }, () => []);
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
    // cell above the current is invalid
    if (!isValid(mx[curRow - 1]?.[curCol])) {
      // (-1) -> 0
      curColTopCluesIdx += 1;
    }
    const curColTopCluesCount = top[curCol][curColTopCluesIdx] ?? 0;
    top[curCol][curColTopCluesIdx] = curColTopCluesCount + 1;

    // left
    let curRowLeftCluesIdx = left[curRow].length - 1;
    // cell before the current is invalid
    if (!isValid(mx[curRow][curCol - 1])) {
      curRowLeftCluesIdx += 1;
    }
    const curRowLeftCluesCount = left[curRow][curRowLeftCluesIdx] ?? 0;
    left[curRow][curRowLeftCluesIdx] = curRowLeftCluesCount + 1;
  }
}
