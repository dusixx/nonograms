import { BaseElement } from './base-element.js';

export class Element extends BaseElement {
  constructor(props, ...children) {
    super(props, ...children);
  }

  dispatch(name, detail, opts) {
    return this.ref.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        cancelable: true,
        detail: { ...detail, target: this },
        ...opts,
      })
    );
  }

  set visibile(v) {
    const { style } = this.ref;
    style.visibility = v ? 'visible' : 'hidden';
    style.pointerEvents = v ? '' : 'none';
  }

  hide() {
    this.ref.style.display = 'none';
  }

  show() {
    this.ref.style.display = '';
  }
}
