import { Button, Element, SVGElement, Toggler } from '../components/index.js';

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
    { href: './assets/icons.svg#icon-star' }
  )
);

const reviewerModeToggler = new Toggler(
  { className: cls.togglerReviewerMode },
  {
    onSvgHref: './assets/icons.svg#icon-eye-on',
    offSvgHref: './assets/icons.svg#icon-eye-off',
  }
);

const soundToggler = new Toggler(
  { className: cls.togglerSound },
  {
    onSvgHref: './assets/icons.svg#icon-sound-on',
    offSvgHref: './assets/icons.svg#icon-sound-off',
  }
);

const themeToggler = new Toggler(null, {
  onSvgHref: './assets/icons.svg#icon-moon3',
  offSvgHref: './assets/icons.svg#icon-sun3',
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
