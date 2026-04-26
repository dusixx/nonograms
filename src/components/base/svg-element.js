const NAMESPACE_URI = 'http://www.w3.org/2000/svg';
const NAMESPACE = 'http://www.w3.org/1999/xlink';

export class SVGElement {
  #ref;
  #children = [];
  /**
   * @param {{className: string, rest: any[]}} svgAttr - `<svg>` attributes
   * @param {Array<{href: string, className: string, rest: any[]}>} useAttr - nesting `<use>` attributes
   * */
  constructor({ className, ...rest }, ...useAttr) {
    const ref = document.createElementNS(NAMESPACE_URI, 'svg');

    if (className) {
      ref.classList.add('class', className);
    }
    this.#ref = ref;
    this.append(...useAttr);
    this.setAttribute(rest);
  }

  /** @param {Array<{href: string, className: string, rest: any[]}>} useAttr - nesting `<use>` attributes */
  append(...useAttr) {
    const uses = useAttr.map(({ href, className, ...rest }) => {
      const use = document.createElementNS(NAMESPACE_URI, 'use');

      // set className and href
      if (className) {
        use.classList.add(className);
      }
      use.setAttributeNS(NAMESPACE, 'href', href);

      // set other attributes if specified
      Object.entries(rest).forEach(([attr, value]) => {
        use.setAttribute(attr, value);
      });
      this.#children.push(use);

      return use;
    });
    this.#ref.append(...uses);
  }

  setAttribute(map) {
    Object.entries(map).forEach(([name, value]) => {
      this.#ref.setAttribute(name, value);
    });
  }

  removeAttribute(name) {
    this.#ref.removeAttribute(name);
  }

  toggleClass(name, force) {
    return this.#ref.classList.toggle(name, force);
  }

  remove() {
    this.#ref.remove();
  }

  removeChildren() {
    this.#children.forEach((el) => el.remove());
    this.#children.length = 0;
  }

  get children() {
    return [...this.#children];
  }

  get ref() {
    return this.#ref;
  }
}
