import { ClassName, ICONS_URL } from '../../common/constants/index.js';
import { elapsedToTime } from '../../common/utils.js';
import { Element, SVGElement } from '../base/index.js';

export const LATEST_COUNT = 5;

const COLUMN_NAME = ['#', 'puzzle', 'complexity', 'elapsed'];

const REWARD_COLOR = ['#b19859', '#89938e', '#9d7367', '#a7a7a7', '#a7a7a7'];

export const createScoreHeaderView = () => {
  return new Element(
    { tag: 'ul', className: ClassName.ScoreHeader },
    ...COLUMN_NAME.map(
      (text) =>
        new Element({ tag: 'li', className: ClassName.ScoreRowItem, text })
    )
  );
};

const getIconHref = (place) => {
  place = place > 3 ? 3 : place;
  return `${ICONS_URL}#icon-r${place + 1}`;
};

export const createScoreRowView = (rowData, place) => {
  const icon = new SVGElement('', {
    href: getIconHref(place),
  });
  icon.ref.style.fill = REWARD_COLOR[place] ?? '';

  return new Element(
    { tag: 'ul', className: ClassName.ScoreRow },
    // icon
    new Element({ tag: 'li', className: ClassName.ScoreRowItem }, icon),
    // row items
    ...Object.entries(rowData).map(([name, text]) => {
      if (/^elapsed$/i.test(name)) {
        text = elapsedToTime(text);
      }
      return new Element({
        tag: 'li',
        className: ClassName.ScoreRowItem,
        text,
      });
    })
  );
};

export const createScorePlugView = () => {
  return new Element({
    tag: 'span',
    className: ClassName.ScoreNoResults,
    text: '(no results)',
  });
};
