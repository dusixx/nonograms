import { Element } from './base/element.js';
import { isPositiveInt, msToDHMS } from '../utils/helpers.js';

const cls = {
  timer: 'timer',
};

export class Timer extends Element {
  #elapsed = 0;
  #hours;
  #mins;
  #secs;
  #timerId;

  constructor() {
    super({ className: cls.timer });

    this.#hours = new Element({ tag: 'span', text: '00:' });
    this.#mins = new Element({ tag: 'span', text: '00:' });
    this.#secs = new Element({ tag: 'span', text: '00' });

    this.append(this.#hours, this.#mins, this.#secs);
    this.#hours.hide();
  }

  #render = () => {
    this.#elapsed += 1;
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

  start(secs) {
    this.#elapsed = secs;
    this.#timerId = setInterval(this.#render, 1000);

    return this;
  }

  stop() {
    clearInterval(this.#timerId);
    this.#timerId = 0;

    return this;
  }

  reset() {
    this.#elapsed = 0;
    this.#render();

    return this;
  }

  set elapsed(v) {
    if (!isPositiveInt(v) || this.#timerId) {
      return;
    }
    this.#elapsed = v;
  }

  get elapsed() {
    return this.#elapsed;
  }
}
