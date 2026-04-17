import { ClassName } from '../common/constants/index.js';
import { isFunc } from '../common/utils.js';
import { Button, SVGElement } from './base/index.js';

export class Toggler extends Button {
  #enabled;
  #svg;
  #onSvgRef;
  #offSvgRef;
  #onToggle;

  constructor(props, { onSvgHref, offSvgHref } = '') {
    super({ className: ClassName.Toggler, ...props });

    this.#svg = new SVGElement(
      { className: ClassName.TogglerIcon },
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

  get isEnabled() {
    return this.#enabled;
  }

  set isEnabled(v) {
    this.toggle(!!v);
  }

  set onToggle(handler) {
    this.#onToggle = isFunc(handler) ? handler : null;
  }

  get onToggle() {
    return this.#onToggle;
  }

  toggle(force) {
    this.#enabled = force != null ? !!force : !this.#enabled;
    this.#onSvgRef.style.display = this.#enabled ? '' : 'none';
    this.#offSvgRef.style.display = this.#enabled ? 'none' : '';

    return this.#enabled;
  }
}
