import { isNumber, isUndefined } from './is';

export default function (
  node: HTMLElement,
  attr: string,
  value: number | string
) {
  if (!node) {
    return;
  }
  if (isUndefined(value)) {
    // @ts-ignore
    if (node[attr]) {
      // @ts-ignore
      return node[attr];
    }
    // @ts-ignore
    if (node.style && node.style[attr]) {
      // @ts-ignore
      return node.style[attr];
    }
    if (window.getComputedStyle) {
      // @ts-ignore
      return window.getComputedStyle(node, null)[attr];
    }
  }
  // @ts-ignore
  node.style[attr] =
    isNumber(value) && !['zIndex', 'opacity'].includes(attr)
      ? `${value}px`
      : value;
}
