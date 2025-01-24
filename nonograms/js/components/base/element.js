import { BaseElement } from './base-element.js';

export class Element extends BaseElement {
  constructor(props, ...children) {
    super(props, ...children);
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
