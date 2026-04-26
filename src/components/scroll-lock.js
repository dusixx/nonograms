import { isVScrollBarVisible } from '@/common';

const { body } = document;

export class ScrollLock {
  static #top;
  static #css;
  static #locked;

  static lock() {
    this.#top = window.scrollY;
    this.#css = body.style.cssText;
    this.#locked = true;

    body.style.cssText = `
        ${this.#css};
        position: fixed;
        top: -${this.#top}px;
        width: 100%;
        overflow-y: ${isVScrollBarVisible() ? `scroll` : `hidden`};
      `;
    return this.#locked;
  }

  static unlock() {
    this.#locked = false;

    body.style.cssText = this.#css;
    body.style.scrollBehavior = 'auto';
    window.scrollTo({ top: this.#top });
    body.style.removeProperty('scroll-behavior');

    return this.#locked;
  }

  static toggle(force) {
    const flag = force == null ? this.#locked : !force;
    return flag ? this.unlock() : this.lock();
  }
}
