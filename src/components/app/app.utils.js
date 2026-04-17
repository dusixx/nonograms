import hintImageUrl from '../../assets/hint.png';
import { ClassName, LocalStorageKey } from '../../common/constants/index.js';
import { modal } from '../layout/main.js';

const MODAL_WIDTH = '250px';

const HINT_MESSAGE =
  'Click on this button in the header to speed up the task check';

export const showHintOnce = () => {
  if (Object.hasOwn(localStorage, LocalStorageKey.Hint)) {
    return;
  }
  modal.content.ref.style.width = MODAL_WIDTH;
  modal.show(
    new Element({ tag: 'img', src: hintImageUrl, alt: 'hint' }),
    new Element({
      tag: 'p',
      className: ClassName.ModalPara,
      text: HINT_MESSAGE,
    })
  );
  localStorage.setItem(LocalStorageKey.Hint, '1');
};
