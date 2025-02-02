import { Element, Button } from './base/index.js';
import { classes as cls } from '../constants/classes.js';
import { isNonEmptyStr, isStr } from '../utils/helpers.js';
import { ScrollLock } from './scroll-lock.js';

export class Modal extends Element {
  #content;
  #btn;

  constructor() {
    super({ className: cls.backdrop });

    this.#content = new Element({ className: cls.modalContent });
    this.#btn = new Button({ className: cls.modalBtn, text: 'ok' });
    this.append(
      new Element({ className: cls.modal }, this.#content, this.#btn)
    );
    this.#addInteractivity();
  }

  #addInteractivity() {
    this.addListener('click', (e) => {
      // directly on the backdrop
      if (e.target === e.currentTarget) {
        this.#toggle(false);
      }
    });
    this.#btn.onClick = () => {
      this.#toggle(false);
    };
  }

  #handleEscKeydown = (e) => {
    if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      this.#toggle(false);
    }
  };

  #toggle(force) {
    const wasShown = this.toggleClass(cls.backdropActive, force);
    ScrollLock.toggle(wasShown);
    //document.documentElement.classList.toggle(cls.scrollLock, wasShown);

    if (wasShown) {
      document.addEventListener('keydown', this.#handleEscKeydown, {
        once: true,
      });
    } else {
      document.removeEventListener('keydown', this.#handleEscKeydown);
    }
    return wasShown;
  }

  show(cont, width) {
    if (isStr(cont)) {
      cont = new Element({ tag: 'p', text: cont, className: cls.modalPara });
    }
    if (!(cont instanceof Element)) {
      return;
    }
    this.#content.ref.style.width = width ?? '';

    this.#content.removeChildren();
    this.#content.append(cont);
    this.#toggle(true);
  }

  hide() {
    this.#toggle(false);
  }
}
