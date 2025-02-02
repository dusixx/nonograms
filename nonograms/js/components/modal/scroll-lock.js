const root = document.documentElement;

const isVScrollBarVisible = () => {
  const { body } = document;
  const curBodyClientWidth = body.clientWidth;
  const curBodyOverflow = body.style.overflow;

  body.style.overflow = 'hidden';
  const res = curBodyClientWidth !== body.clientWidth;
  body.style.overflow = curBodyOverflow;

  return res;
};

export class ScrollLock {
  static #top;
  static #css;
  static #locked;

  static lock() {
    this.#top = window.scrollY;
    this.#css = root.style.cssText;
    this.#locked = true;

    root.style.cssText = `
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

    root.style.cssText = this.#css;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: this.#top });
    root.style.removeProperty('scroll-behavior');

    return this.#locked;
  }

  static toggle(force) {
    const flag = force == null ? this.#locked : !force;
    return flag ? this.unlock() : this.lock();
  }
}
