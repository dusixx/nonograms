import { Element, SVGElement } from './base/index.js';
import { classes as cls, localStorageKey } from '../constants/index.js';
import {
  isArray,
  isNonEmptyStr,
  isPositiveInt,
  elapsedToTime,
  JSONParse,
} from '../utils/helpers.js';

const column = '# puzzle complexity elapsed'.split(' ');

const iconSrc = (idx) => {
  idx = idx > 3 ? 3 : idx;
  return `./assets/icons.svg#icon-r${idx + 1}`;
};

//
// ScoreTable
//

export class ScoreTable extends Element {
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
    this.#data.sort((a, b) => a.elapsed - b.elapsed);
    this.#data = this.#data.slice(0, 5);
  }

  update() {
    this.#results.removeChildren();
    //{ puzzleName, lvlName, elapsed }
    const allRows = this.#data.map((rowData, place) => {
      const icon = new SVGElement('', { href: iconSrc(place) });
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
    this.#results.append(...allRows);
  }

  saveToLocalStorage() {
    localStorage.setItem(localStorageKey.score, JSON.stringify(this.#data));
  }

  loadFromLocalStorage() {
    const data = JSONParse(localStorage.getItem(localStorageKey.score));
    if (!isArray(data)) {
      return;
    }
    this.#data = data.sort((a, b) => a.elapsed - b.elapsed).slice(0, 5);
    this.update();
  }
}
