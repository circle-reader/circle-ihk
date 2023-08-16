import { isNumber } from './is';

export default function zIndex() {
  // @ts-ignore
  const zIndex = document._zindex;
  if (isNumber(zIndex)) {
    return zIndex;
  } else {
    let value = 0;
    document.body.querySelectorAll('*').forEach((item) => {
      const zindex = Number.parseInt(
        window.getComputedStyle(item, null).getPropertyValue('z-index'),
        10
      );
      zindex > value && (value = zindex);
    });
    if (value <= 0) {
      return;
    }
    // 配合 drawer 使用不能低于遮罩层的 1000
    if (value <= 1000) {
      value = 1000;
    }
    value++;
    // @ts-ignore
    document._zindex = value;
    return value;
  }
}
