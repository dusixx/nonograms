import { BaseElement } from './base-element.js';

export class Element extends BaseElement {
  dispatch(name, opts) {
    return this.ref.dispatchEvent(
      new Event(name, {
        bubbles: true,
        cancelable: true,
        ...opts,
      })
    );
  }

  dispatchCustom(name, detail, opts) {
    return this.ref.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        cancelable: true,
        detail: { ...detail, target: this },
        ...opts,
      })
    );
  }

  allowPointerEvents(v) {
    this.ref.style.pointerEvents = v ? '' : 'none';
  }

  set visible(v) {
    const { style } = this.ref;
    style.visibility = v ? 'visible' : 'hidden';
    style.pointerEvents = v ? '' : 'none';
  }

  get visible() {
    const { style } = this.ref;
    return style.visibility === 'visible';
  }

  hide() {
    this.ref.style.display = 'none';
  }

  show() {
    this.ref.style.display = '';
  }
}
