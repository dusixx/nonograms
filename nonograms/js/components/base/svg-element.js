const svg = {
  NS_URI: 'http://www.w3.org/2000/svg',
  NS: 'http://www.w3.org/1999/xlink',
};

export class SVGElement {
  #ref;
  #children = [];

  // Array<{href, className, ...rest}> useAttrsMap - <use> elements attributes
  constructor({ className, ...rest }, ...useAttrsMap) {
    const ref = document.createElementNS(svg.NS_URI, 'svg');

    if (className) {
      ref.className.baseVal = className;
    }
    this.#ref = ref;
    this.append(...useAttrsMap);
    // NOTE: setAttributeNS(...)???
    this.setAttribute(rest);
  }

  append(...useAttrsMap) {
    const uses = useAttrsMap.map(({ href, className, ...rest }) => {
      const use = document.createElementNS(svg.NS_URI, 'use');

      // set className and href
      if (className) {
        use.className.baseVal = className;
      }
      use.setAttributeNS(svg.NS, 'href', href);

      // set other attrs if specified
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
      // setAttributeNS(...)???
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
