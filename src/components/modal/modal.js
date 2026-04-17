import { ClassName } from '../../common/constants/index.js';
import { Button, Element } from '../base/index.js';
import { ScrollLock } from './scroll-lock.js';

export class Modal extends Element {
  #content;
  #btn;

  constructor() {
    super({ className: ClassName.Backdrop });

    this.#content = new Element({ className: ClassName.ModalContent });
    this.#btn = new Button({ className: ClassName.ModalBtn, text: 'ok' });
    this.append(
      new Element({ className: ClassName.Modal }, this.#content, this.#btn)
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

  #handleKeydown = (e) => {
    if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      this.#toggle(false);
    }
  };

  #toggle(force) {
    const wasShown = this.toggleClass(ClassName.BackdropActive, force);
    ScrollLock.toggle(wasShown);

    if (wasShown) {
      document.addEventListener('keydown', this.#handleKeydown, {
        once: true,
      });
    } else {
      document.removeEventListener('keydown', this.#handleKeydown);
    }
    return wasShown;
  }

  show(...children) {
    this.#content.removeChildren();
    this.#content.append(...children);
    this.#toggle(true);
  }

  hide() {
    this.#toggle(false);
  }

  get content() {
    return this.#content;
  }
}
