import url from './url';
import each from './each';
import { isElement, isString } from './is';
import iterator from './iterator';
import { App } from '../interface';

function formatFN(app: App, node: HTMLElement) {
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
        const target =
          item._mirrorElement && item._mirrorElement._mirrorElement
            ? item._mirrorElement._mirrorElement
            : item;
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

export default function pageNode(app: App, format = true) {
  const data = app.field('node');
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (Array.isArray(item.content)) {
        let data = '';
        item.content.forEach((node: { content: HTMLElement }) => {
          if (isString(node.content)) {
            data += node.content;
          } else if (isElement(node.content)) {
            data += (format ? formatFN(app, node.content) : node.content)
              .innerHTML;
          }
        });
        const wrapper = document.createElement('div');
        wrapper.innerHTML = data;
        item.content = wrapper;
      } else if (isElement(item.content)) {
        item.content = format ? formatFN(app, item.content) : item.content;
      }
      if (!item.title) {
        item.title = `${app.i18n('name')} - ${app.i18n('description')}`;
      }
      return item;
    });
  }

  return [
    {
      url: url(),
      title: document.title,
      content: document.body,
      domain: location.hostname,
      // modified:,
      // published:,
      // author:,
      // excerpt:,
      // read_time:,
      // word_count:,
      // cover:,
      // tags:,
      // rtl:,
      // lang:,
      // text:,
      // next:,
      // from:,
    },
  ];
}
