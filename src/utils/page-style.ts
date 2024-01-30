import each from './each';
import isTag from './istag';
import { isElement } from './is';
import { App } from '../interface';

export default function pageStyle(app: App) {
  const container = app.field('container');
  if (!isElement(container)) {
    return '';
  }
  const parentElement = container.parentNode;
  if (!parentElement) {
    return '';
  }
  let stylesToReturn = '';
  each(parentElement.children, (children: Element) => {
    if (!isTag(children, 'style')) {
      return;
    }
    const styleToReturn = children.textContent || '';
    styleToReturn.length > 0 && (stylesToReturn += styleToReturn);
  });
  const attrs: Array<string> = [];
  const cssText = container.style.cssText;
  if (cssText.length > 0) {
    cssText.split(';').forEach(function (item: string) {
      const attr = item.trim();
      attr.startsWith('--') && attrs.push(attr);
    });
  }
  if (attrs.length > 0) {
    each(attrs, (attr: string) => {
      const [key, value] = attr.split(':');
      stylesToReturn = stylesToReturn.replace(
        new RegExp(`var\\(${key}\\)`, 'g'),
        value
      );
    });
  }
  return stylesToReturn.replace(/\n+/g, '');
}
