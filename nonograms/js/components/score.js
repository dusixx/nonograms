import { Element, SVGElement } from './base/index.js';
import {
  classes as cls,
  localStorageKey,
  scoreColumnName as column,
  scoreRewardColor as fill,
} from '../constants/index.js';
import {
  isArray,
  isNonEmptyStr,
  isPositiveInt,
  elapsedToTime,
  JSONParse,
} from '../utils/helpers.js';

const LATEST_COUNT = 5;

// place from 0
const getRewardIconHref = (place) => {
  place = place > 3 ? 3 : place;
  return `./assets/icons.svg#icon-r${place + 1}`;
};

export class Score extends Element {
  #data = [];

  #results;

  constructor() {
    super({ className: cls.score });
    const header = new Element(
      { tag: 'ul', className: cls.scoreHeader },
      ...column.map(
        (text) => new Element({ tag: 'li', className: cls.scoreRowItem, text })
      )
    );
    this.#results = new Element({ className: cls.scoreResults });
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
      icon.ref.style.fill = fill[place] ?? '';

      return new Element(
        { tag: 'ul', className: cls.scoreRow },
        // reward img
        new Element({ tag: 'li', className: cls.scoreRowItem }, icon),
        // score row items
        ...Object.entries(rowData).map(([name, text]) => {
          if (/^elapsed$/i.test(name)) {
            text = elapsedToTime(text);
          }
          return new Element({
            tag: 'li',
            className: cls.scoreRowItem,
            text,
          });
        })
      );
    });
    if (allRows.length === 0) {
      this.#results.append(
        new Element({
          tag: 'span',
          className: cls.scoreNoResults,
          text: '(no results)',
        })
      );
    } else {
      this.#results.append(...allRows);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(localStorageKey.score, JSON.stringify(this.#data));
  }

  loadFromLocalStorage() {
    const data = JSONParse(localStorage.getItem(localStorageKey.score));
    this.#data = isArray(data) ? data.slice(-LATEST_COUNT) : [];
    this.update();
  }
}
