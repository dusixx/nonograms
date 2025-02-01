import { Element } from './base/element.js';
import { puzzles } from '../../data/puzzles/index.js';
import { isFunc, rndInt } from '../utils/helpers.js';
import { Button } from './button.js';
import { classes as cls } from '../constants/index.js';

export class PuzzleSelect extends Element {
  #level;
  #puzzle;
  #random;
  #onChange;

  constructor(props) {
    super({ className: cls.puzzleSelect, ...props });
    const lvlNames = Object.keys(puzzles);

    this.#level = new Element(
      {
        tag: 'select',
        className: cls.puzzleSelectLvl,
      },
      ...lvlNames.map(
        (value) => new Element({ tag: 'option', value, text: value })
      )
    );
    this.#puzzle = new Element({
      tag: 'select',
      className: cls.puzzleSelectPic,
    });
    this.#random = new Button({
      className: cls.puzzleSelectRnd,
      text: 'random',
    });
    this.#updatePuzzles(lvlNames[0]);
    this.append(this.#level, this.#puzzle, this.#random);
    this.#addInteractivity();
  }

  #updatePuzzles = (lvlName, callback) => {
    if (!Object.hasOwn(puzzles, lvlName)) {
      return;
    }
    const puzzleData = Object.values(puzzles[lvlName]);

    this.#puzzle.removeChildren();
    this.#puzzle.append(
      ...puzzleData
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id, name, mx }) => {
          callback?.({ id, name, mx });

          const opt = new Element({
            tag: 'option',
            value: id,
            text: name,
          });
          return opt;
        })
    );
  };

  update({ lvlName, puzzleId, force }) {
    if (
      !Object.hasOwn(puzzles, lvlName) ||
      (this.#level.ref.value === lvlName &&
        this.#puzzle.ref.value === puzzleId &&
        !force)
    ) {
      return;
    }
    let isPuzzleIdExists;
    this.#level.ref.value = lvlName;

    this.#updatePuzzles(lvlName, ({ id }) => {
      isPuzzleIdExists = isPuzzleIdExists || id === puzzleId;
    });
    this.#puzzle.ref.value = isPuzzleIdExists
      ? puzzleId
      : puzzles[lvlName][0].id;
  }

  random() {
    const lvlNames = Object.keys(puzzles);
    const lvlName = lvlNames[rndInt(0, lvlNames.length - 1)];
    const puzzleData = puzzles[lvlName];
    const { id: puzzleId } = puzzleData[rndInt(0, puzzleData.length - 1)];

    const { lvlName: curLvlName, puzzleId: curPuzzleId } = this.value;
    if (lvlName === curLvlName && puzzleId === curPuzzleId) {
      return this.random();
    }
    this.update({ lvlName, puzzleId });
    this.#puzzle.dispatch('change');
  }

  get value() {
    return {
      lvlName: this.#level.ref.value,
      puzzleId: this.#puzzle.ref.value,
    };
  }

  #getPuzzleData = ({ lvlName, puzzleId }) => {
    return Object.values(puzzles[lvlName]).find((data) => data.id === puzzleId);
  };

  #handleLevelChange = (e) => {
    const {
      target: { value: lvlName },
    } = e;
    this.#updatePuzzles(lvlName);
    this.#puzzle.dispatch('change');
  };

  #handlePuzzleChange = (e) => {
    this.#onChange?.(this.puzzleData, e);
  };

  #addInteractivity() {
    this.#level.addListener('change', this.#handleLevelChange);
    this.#puzzle.addListener('change', this.#handlePuzzleChange);
    this.#random.onClick = () => this.random();
  }

  get puzzleData() {
    return this.#getPuzzleData({
      lvlName: this.#level.ref.value,
      puzzleId: this.#puzzle.ref.value,
    });
  }

  set onChange(handler) {
    this.#onChange = isFunc(handler) ? handler : null;
  }
}
