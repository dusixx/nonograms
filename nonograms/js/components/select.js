import { Component } from './base/component.js';
import { isFunc, isPrimitive } from '../utils/index.js';

export class Select extends Component {
  #onChange;

  constructor(props, optionValues) {
    const opts = Array.isArray(optionValues) ? optionValues : [];

    const options = opts.map((itm) => {
      let value = '';
      let text = '';

      if (isPrimitive(itm)) {
        text = value = String(itm);
      } else {
        text = itm.text;
        value = itm.value ?? text;
      }
      return new Component({ tag: 'option', text, value });
    });
    // tag is always be 'select'
    super({ ...props, tag: 'select' }, ...options);
  }

  set onChange(handler) {
    this.#onChange = isFunc(handler) ? (e) => handler(e.target.value, e) : null;

    if (this.#onChange) {
      this.addListener('change', this.#onChange);
    } else {
      this.removeListener('change', this.#onChange);
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
