import {
  ClassName,
  ICONS_URL,
  LocalStorageKey,
} from '../common/constants/index.js';
import {
  elapsedToTime,
  isArray,
  isNonEmptyStr,
  isPositiveInt,
  JSONParse,
} from '../common/utils.js';
import { Element, SVGElement } from './base/index.js';

const LATEST_COUNT = 5;

// place from 0
const getRewardIconHref = (place) => {
  place = place > 3 ? 3 : place;
  return `${ICONS_URL}#icon-r${place + 1}`;
};

const scoreColumnName = ['#', 'puzzle', 'complexity', 'elapsed'];
const scoreRewardColor = [
  '#b19859',
  '#89938e',
  '#9d7367',
  '#a7a7a7',
  '#a7a7a7',
];

export class Score extends Element {
  #data = [];
  #results;

  constructor() {
    super({ className: ClassName.Score });
    const header = new Element(
      { tag: 'ul', className: ClassName.ScoreHeader },
      ...scoreColumnName.map(
        (text) =>
          new Element({ tag: 'li', className: ClassName.ScoreRowItem, text })
      )
    );
    this.#results = new Element({ className: ClassName.ScoreResults });
    this.append(header, this.#results);
  }

  add({ puzzleName, lvlName, elapsed } = '') {
    if (
      !isNonEmptyStr(puzzleName) ||
      !isNonEmptyStr(lvlName) ||
      !isPositiveInt(elapsed)
    ) {
      return;
    }
    this.#data.push({ puzzleName, lvlName, elapsed });
    // remove the oldest
    if (this.#data.length > LATEST_COUNT) {
      this.#data = this.#data.slice(1);
    }
  }

  update() {
    this.#results.removeChildren();
    const sorted = [...this.#data].sort((a, b) => a.elapsed - b.elapsed);

    // { puzzleName, lvlName, elapsed }
    const allRows = sorted.map((rowData, place) => {
      const icon = new SVGElement('', { href: getRewardIconHref(place) });
      icon.ref.style.fill = scoreRewardColor[place] ?? '';

      return new Element(
        { tag: 'ul', className: ClassName.ScoreRow },
        // reward img
        new Element({ tag: 'li', className: ClassName.ScoreRowItem }, icon),
        // score row items
        ...Object.entries(rowData).map(([name, text]) => {
          if (/^elapsed$/i.test(name)) {
            text = elapsedToTime(text);
          }
          return new Element({
            tag: 'li',
            className: ClassName.ScoreRowItem,
            text,
          });
        })
      );
    });
    if (allRows.length === 0) {
      this.#results.append(
        new Element({
          tag: 'span',
          className: ClassName.ScoreNoResults,
          text: '(no results)',
        })
      );
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
