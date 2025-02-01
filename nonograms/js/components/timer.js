import { Element } from './base/element.js';
import { isPositiveInt, msToDHMS } from '../utils/helpers.js';
import { classes as cls } from '../constants/index.js';

export class Timer extends Element {
  #elapsed = 0;
  #hours;
  #mins;
  #secs;
  #timerId;

  constructor() {
    super({ className: cls.timer });

    this.#hours = new Element({ tag: 'span' });
    this.#mins = new Element({ tag: 'span' });
    this.#secs = new Element({ tag: 'span' });

    this.append(this.#hours, this.#mins, this.#secs);
    this.#init();
  }

  #init = () => {
    this.#secs.text = '00';
    this.#mins.text = '00:';
    this.#hours.text = '00:';
    this.#hours.hide();
    this.#timerId = 0;
    this.#elapsed = 0;
  };

  #render = () => {
    const { secs, mins, hours } = msToDHMS(this.#elapsed * 1000);

    this.#secs.text = `${secs}`.padStart(2, 0);
    if (mins > 0) {
      this.#mins.text = `${mins}`.padStart(2, 0) + ':';
    }
    if (hours > 0) {
      this.#hours.show();
      this.#hours.text = `${hours}`.padStart(2, 0) + ':';
    }
  };

  start() {
    this.#render();

    this.#timerId = setInterval(() => {
      this.#elapsed += 1;
      this.#render();
    }, 1000);

    return this;
  }

  stop() {
    clearInterval(this.#timerId);
    return this;
  }

  reset() {
    clearInterval(this.#timerId);
    this.#init();
    return this;
  }

  set elapsed(v) {
    if (!isPositiveInt(v) || this.#timerId) {
      return;
    }
    this.#elapsed = v;
    this.#render();
  }

  get elapsed() {
    return this.#elapsed;
  }
}
