import { ClassName, IconUrl } from '../../common/constants/index.js';
import { Button, Element, SVGElement, Toggler } from '../index.js';
import { Title } from './constants.js';

const logo = new Element(
  { className: ClassName.Logo },
  new SVGElement({ className: ClassName.LogoIcon }, { href: IconUrl.Logo }),
  new Element({ tag: 'span', className: ClassName.LogoText, text: 'nonograms' })
);

export const scoreBtn = new Button(
  { className: ClassName.ScoreBtn, title: Title.ScoreBtn },
  new SVGElement({ className: ClassName.ScoreBtnIcon }, { href: IconUrl.Star })
);

export const reviewerModeToggler = new Toggler(
  {
    className: ClassName.TogglerReviewerMode,
    title: Title.ReviewerModeToggler,
  },
  {
    onSvgHref: IconUrl.EyeOn,
    offSvgHref: IconUrl.EyeOff,
  }
);

export const soundToggler = new Toggler(
  { className: ClassName.TogglerSound, title: Title.SoundToggler },
  {
    onSvgHref: IconUrl.SoundOn,
    offSvgHref: IconUrl.SoundOff,
  }
);

export const themeToggler = new Toggler(
  { title: Title.ThemeToggler },
  {
    onSvgHref: IconUrl.Moon,
    offSvgHref: IconUrl.Sun,
  }
);

// header controls
const headerControls = new Element(
  { className: ClassName.HeaderControls },
  scoreBtn,
  reviewerModeToggler,
  themeToggler,
  soundToggler
);

const wrapper = new Element(
  { className: ClassName.HeaderWrapper },
  logo,
  headerControls
);

export const header = new Element(
  { tag: 'header', className: ClassName.Header },
  wrapper
);
