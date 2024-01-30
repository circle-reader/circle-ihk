import url from './url';
import each from './each';
import remove from './remove';
import { isElement } from './is';
import iterator from './iterator';
import { App } from '../interface';

export default function pageNode(app: App) {
  const data = app.field('node');
  const currentUrl = url();
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item.url === currentUrl) {
        if (isElement(item.content)) {
          const images = item.content.getElementsByTagName('img');
          if (images.length > 0) {
            const contentClone = iterator(item.content);
            const container = app.field('container');
            if (
              isElement(container) &&
              container.style.cssText.indexOf('imagehide: none') >= 0
            ) {
              each(contentClone.getElementsByTagName('img'), (item) =>
                remove(item)
              );
            } else {
              each(contentClone.getElementsByTagName('img'), (item) => {
                const attrToRemove: string[] = [];
                each(item.attributes, (attribute) => {
                  const name = attribute.nodeName;
                  !['class', 'src'].includes(name) && attrToRemove.push(name);
                });
                each(attrToRemove, (attr) => {
                  item.removeAttribute(attr);
                });
                const width = Math.min(item.width, 410);
                item.width = width;
                item.height = item.height * (width / item.width);
                item.src = item.src.replace('https', 'http');
              });
            }
            item.content = contentClone;
          }
        }
        return item;
      }
      if (!item.title) {
        item.title = `${app.i18n('name')} - ${app.i18n('description')}`;
      }
      return item;
    });
  }

  return [
    {
      url: currentUrl,
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
