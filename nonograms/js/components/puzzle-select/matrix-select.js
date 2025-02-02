import { Element } from '../base/element.js';
import { isFunc } from '../../utils/index.js';
import { matrices } from '../../../data/puzzles/matrices.js';

export class MatrixSelect extends Element {
  #onChange;

  constructor(props) {
    const optGroups = Object.entries(matrices).map(([lvl, mxs]) => {
      const group = new Element({ tag: 'optgroup', label: lvl });

      const opts = Object.keys(mxs).map((mxName) => {
        return new Element({
          tag: 'option',
          value: `${lvl}-${mxName}`,
          text: mxName,
        });
      });
      group.append(...opts);

      return group;
    });
    super({ ...props, tag: 'select' }, ...optGroups);
  }

  #handleSelectChange = (e) => {
    const { value } = e.target;
    const [lvl, mxname] = value.split('-');

    this.#onChange?.(matrices[lvl][mxname], value, e);
  };

  set onChange(handler) {
    this.#onChange = isFunc(handler) ? handler : null;

    if (this.#onChange) {
      this.addListener('change', this.#handleSelectChange);
    } else {
      this.removeListener('change', this.#handleSelectChange);
    }
  }

  get disabled() {
    return this.ref.disabled;
  }

  set disabled(v) {
    this.ref.disabled = Boolean(v);
  }

  get value() {
    return this.ref.value;
  }

  set value(v) {
    this.ref.value = v;
  }
}
