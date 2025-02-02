import { Button, Element, SVGElement, Toggler } from '../components/index.js';

import {
  localStorageKey as lsKey,
  soundState,
  eventName,
  colorTheme,
  classes as cls,
  iconUrl,
} from '../constants/index.js';

//
// exports
export { header, scoreBtn, reviewerModeToggler, themeToggler, soundToggler };
//

const logo = new Element(
  { className: cls.logo },
  new SVGElement({ className: cls.logoIcon }, { href: iconUrl.logo }),
  new Element({ tag: 'span', className: cls.logoText, text: 'nonograms' })
);

const scoreBtn = new Button(
  { className: cls.scoreBtn },
  new SVGElement(
    { className: cls.scoreBtnIcon, title: 'Score' },
    { href: iconUrl.star }
  )
);

const reviewerModeToggler = new Toggler(
  { className: cls.togglerReviewerMode },
  {
    onSvgHref: iconUrl.eyeOn,
    offSvgHref: iconUrl.eyeOff,
  }
);

const soundToggler = new Toggler(
  { className: cls.togglerSound },
  {
    onSvgHref: iconUrl.soundOn,
    offSvgHref: iconUrl.soundOff,
  }
);

const themeToggler = new Toggler(null, {
  onSvgHref: iconUrl.moon,
  offSvgHref: iconUrl.sun,
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
