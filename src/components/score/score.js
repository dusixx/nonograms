import {
  ClassName,
  isArray,
  isNonEmptyStr,
  isPositiveInt,
  JSONParse,
  LocalStorageKey,
} from '@common';
import { Element } from '@components';
import {
  createScoreHeaderView,
  createScorePlugView,
  createScoreRowView,
  LATEST_COUNT,
} from './score.utils.js';

export class Score extends Element {
  #data = [];
  #results;

  constructor() {
    super({ className: ClassName.Score });

    const header = createScoreHeaderView();
    this.#results = new Element({ className: ClassName.ScoreResults });
    this.append(header, this.#results);

    this.loadFromLocalStorage();
  }

  add({ puzzleName, lvlName, elapsed } = {}) {
    if (
      !isNonEmptyStr(puzzleName) ||
      !isNonEmptyStr(lvlName) ||
      !isPositiveInt(elapsed)
    ) {
      return;
    }
    this.#data.push({ puzzleName, lvlName, elapsed });
    // remove the oldest one
    if (this.#data.length > LATEST_COUNT) {
      this.#data = this.#data.slice(1);
    }
  }

  update() {
    this.#results.removeChildren();
    // { puzzleName, lvlName, elapsed }
    const sorted = [...this.#data].sort((a, b) => a.elapsed - b.elapsed);
    const allRows = sorted.map(createScoreRowView);

    if (allRows.length === 0) {
      this.#results.append(createScorePlugView());
    } else {
      this.#results.append(...allRows);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(LocalStorageKey.Score, JSON.stringify(this.#data));
  }

  loadFromLocalStorage() {
    const data = JSONParse(localStorage.getItem(LocalStorageKey.Score));
    this.#data = isArray(data) ? data.slice(-LATEST_COUNT) : [];
    this.update();
  }
}
