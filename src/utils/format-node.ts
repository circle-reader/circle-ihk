import each from './each';
import { isElement } from './is';
import iterator from './iterator';
import { App } from '../interface';

export default function (app: App, node: HTMLElement) {
  const images = node.getElementsByTagName('img');
  if (images.length > 0) {
    const contentClone = iterator(node);
    const container = app.field('container');
    if (
      isElement(container) &&
      container.style.cssText.indexOf('imagehide: none') >= 0
    ) {
      each(
        contentClone.getElementsByTagName('img'),
        (item) =>
          item && item.parentElement && item.parentElement.removeChild(item)
      );
    } else {
      each(contentClone.getElementsByTagName('img'), (item) => {
        let target = item;
        if (item._mirrorElement) {
          if (isElement(item._mirrorElement)) {
            target = item._mirrorElement;
          } else if (item._mirrorElement._mirrorElement) {
            target = item._mirrorElement._mirrorElement;
          }
        }
        const attrToRemove: string[] = [];
        each(item.attributes, (attribute) => {
          const name = attribute.nodeName;
          !['class', 'src'].includes(name) && attrToRemove.push(name);
        });
        each(attrToRemove, (attr) => {
          item.removeAttribute(attr);
        });
        const width = Math.min(target.width, 410);
        item.width = width;
        item.height = target.height * (width / target.width);
        item.src = item.src.replace('https', 'http');
      });
    }
    return contentClone;
  }
  return node;
}
