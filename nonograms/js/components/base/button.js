import { Element } from './element.js';
import { isFunc } from '../../utils/index.js';

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
    this.#addInteractivity();
  }

  #handleOnClick = (e) => {
    return this.#onClick?.(e);
  };

  #addInteractivity = () => {
    this.addListener('click', this.#handleOnClick);
  };

  set onClick(handler) {
    this.#onClick = isFunc(handler) ? handler : null;
  }

  get onClick() {
    return this.#onClick;
  }

  get disabled() {
    return this.ref.disabled;
  }

  set disabled(v) {
    this.ref.disabled = Boolean(v);
  }
}
