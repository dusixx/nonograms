import { Button, Element, SVGElement, Toggler } from '../components/index.js';
import { classes as cls, iconUrl, title } from '../constants/index.js';

const logo = new Element(
  { className: cls.logo },
  new SVGElement({ className: cls.logoIcon }, { href: iconUrl.logo }),
  new Element({ tag: 'span', className: cls.logoText, text: 'nonograms' })
);

export const scoreBtn = new Button(
  { className: cls.scoreBtn, title: title.scoreBtn },
  new SVGElement({ className: cls.scoreBtnIcon }, { href: iconUrl.star })
);

export const reviewerModeToggler = new Toggler(
  { className: cls.togglerReviewerMode, title: title.reviewerModeToggler },
  {
    onSvgHref: iconUrl.eyeOn,
    offSvgHref: iconUrl.eyeOff,
  }
);

export const soundToggler = new Toggler(
  { className: cls.togglerSound, title: title.soundToggler },
  {
    onSvgHref: iconUrl.soundOn,
    offSvgHref: iconUrl.soundOff,
  }
);

export const themeToggler = new Toggler(
  { title: title.themeToggler },
  {
    onSvgHref: iconUrl.moon,
    offSvgHref: iconUrl.sun,
  }
);

// header controls
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

export const header = new Element(
  { tag: 'header', className: cls.header },
  wrapper
);
