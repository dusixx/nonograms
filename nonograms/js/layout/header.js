import { Button, Element, SVGElement } from '../components/index.js';
import { Toggler } from '../components/toggler.js';
import {
  localStorageKey as lsKey,
  soundState,
  eventName,
  colorTheme,
  classes as cls,
} from '../constants/index.js';

//
// exports
export { header, scoreBtn, reviewerModeToggler, themeToggler, soundToggler };
//

const logo = new Element(
  { className: cls.logo },
  new SVGElement(
    { className: cls.logoIcon },
    { href: './assets/icons.svg#icon-nng-logo' }
  ),
  new Element({ tag: 'span', className: cls.logoText, text: 'nonograms' })
);

const scoreBtn = new Button(
  { className: cls.scoreBtn },
  new SVGElement(
    { className: cls.scoreBtnIcon, title: 'Score' },
    { href: './assets/icons.svg#icon-trophy' }
  )
);

const reviewerModeToggler = new Toggler(null, {
  onSvgHref: './assets/icons.svg#icon-eye',
  offSvgHref: './assets/icons.svg#icon-eye-blocked',
});

const soundToggler = new Toggler(null, {
  onSvgHref: './assets/icons.svg#icon-unmute',
  offSvgHref: './assets/icons.svg#icon-mute',
});

const themeToggler = new Toggler(null, {
  onSvgHref: './assets/icons.svg#icon-moon',
  offSvgHref: './assets/icons.svg#icon-sun',
});

//
// Header controls
//
const headerControls = new Element(
  { className: cls.headerControls },
  scoreBtn,
  reviewerModeToggler,
  themeToggler,
  soundToggler
);

const wrapper = new Element(
  { className: cls.headerWrapper },
  logo,
  headerControls
);

const header = new Element({ tag: 'header', className: cls.header }, wrapper);
