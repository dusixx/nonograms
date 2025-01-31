import { Button } from './button.js';
import { SVGElement } from './base/svg-element.js';
import { isPositiveInt, isFunc } from '../utils/helpers.js';

const cls = {
  toggler: 'toggler',
  togglerIcon: 'toggler__icon',
};

export class Toggler extends Button {
  #enabled;
  #svg;
  #onSvgRef;
  #offSvgRef;
  #onToggle;

  constructor(props, { onSvgHref, offSvgHref } = '') {
    super({ className: cls.toggler, ...props });

    this.#svg = new SVGElement(
      { className: cls.togglerIcon },
      { href: onSvgHref },
      { href: offSvgHref }
    );

    this.#onSvgRef = this.#svg.children[0];
    this.#offSvgRef = this.#svg.children[1];

    this.append(this.#svg);
    this.toggle(false);
    this.#addInteractivity();
  }

  #addInteractivity = () => {
    this.onClick = () => {
      this.toggle();
      this.#onToggle?.(this.#enabled);
    };
  };

  set size(v) {
    this.#svg.ref.style.width = this.#svg.ref.style.height = v;
  }

  set fill(v) {
    this.#svg.ref.style.fill = v;
  }

  get isEnabled() {
    return this.#enabled;
  }

  set isEnabled(v) {
    this.toggle(!!v);
  }

  set onToggle(handler) {
    this.#onToggle = isFunc(handler) ? handler : null;
  }

  toggle(force) {
    this.#enabled = force != null ? !!force : !this.#enabled;
    this.#onSvgRef.style.display = this.#enabled ? '' : 'none';
    this.#offSvgRef.style.display = this.#enabled ? 'none' : '';

    return this.#enabled;
  }
}
