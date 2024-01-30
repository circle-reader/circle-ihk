import url from './url';
import { isElement } from './is';
import { App } from '../interface';
import nodeText from './node-text';

export default function pageInfo(app: App) {
  const data = app.field('node');

  if (Array.isArray(data) && data.length > 0) {
    const item = data[0];
    return {
      url: item.url,
      domain: item.domain,
      lang: item.lang || 'zh-Hans',
      title: isElement(item.title) ? nodeText(item.title) : item.title,
    };
  }

  return {
    url: url(),
    domain: location.hostname,
    title: document.title.split(' - ').shift(),
    lang: document.documentElement.getAttribute('lang') || 'zh-Hans',
  };
}
