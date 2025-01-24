import { Element } from './base/element.js';
import { isFunc } from '../utils/index.js';

export class Button extends Element {
  #onClick;

  constructor(props, ...children) {
    // tag is always be 'button'
    super(
      {
        type: 'button',
        ...props,
        tag: 'button',
      },
      ...children
    );
  }

  set onClick(handler) {
    this.#onClick = isFunc(handler) ? handler : null;

    if (this.#onClick) {
      this.addListener('click', this.#onClick);
    } else {
      this.removeListener('click', this.#onClick);
    }
  }

  get disabled() {
    return this.ref.disabled;
  }

  set disabled(v) {
    this.ref.disabled = Boolean(v);
  }
}
