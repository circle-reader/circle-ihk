import { isElement } from './is';

export default function observe(
  target: HTMLElement | Element,
  callback: (value?: NodeList) => void,
  option?: {
    attributeFilter?: string[];
    attributeOldValue?: boolean;
    attributes?: boolean;
    characterData?: boolean;
    characterDataOldValue?: boolean;
    childList?: boolean;
    subtree?: boolean;
  }
) {
  if (!isElement(target)) {
    callback();
    return;
  }
  const detch = new MutationObserver(function (mutations) {
    if (!mutations || mutations.length < 1) {
      return;
    }
    const items = mutations[0].addedNodes;
    if (!items || items.length < 1) {
      return;
    }
    callback(items);
  });
  detch.observe(target, option || { childList: true, subtree: true });
  return () => {
    detch.disconnect();
  };
}
