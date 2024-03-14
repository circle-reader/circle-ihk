import url from './url';
import { App } from '../interface';
import formatNode from './format-node';
import { isElement, isString } from './is';

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
            data += (format ? formatNode(app, node.content) : node.content)
              .innerHTML;
          }
        });
        const wrapper = document.createElement('div');
        wrapper.innerHTML = data;
        item.content = wrapper;
      } else if (isElement(item.content)) {
        item.content = format ? formatNode(app, item.content) : item.content;
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
