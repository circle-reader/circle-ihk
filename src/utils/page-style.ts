import each from './each';
import { App } from '../interface';
import { isTag, isElement } from './is';

export default function pageStyle(app: App) {
  let data = '.container .ant-app{padding-right: 0 !important;}';
  const container = app.field('container');
  if (!isElement(container)) {
    return data;
  }
  const parentElement = container.parentNode;
  if (!parentElement) {
    return data;
  }
  each(parentElement.children, (children: Element) => {
    if (!isTag(children, 'style')) {
      return;
    }
    const styleToReturn = children.textContent || '';
    styleToReturn.length > 0 && (data += styleToReturn);
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
      data = data.replace(new RegExp(`var\\(${key}\\)`, 'g'), value);
    });
  }
  return data.replace(/\\n+/g, ' ');
}
