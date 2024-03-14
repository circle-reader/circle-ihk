import url from './url';
import { App } from '../interface';
import nodeText from './node-text';
import formatNode from './format-node';
import { isElement, isString } from './is';

export default function pageInfo(
  app: App,
  exportFromDOMOrString?: string | HTMLElement,
  format = true
) {
  const returnValue = {
    url: url(),
    content: document.body,
    domain: location.hostname,
    title: document.title.split(' - ').shift(),
    lang: document.documentElement.getAttribute('lang') || 'zh-Hans',
  };
  const data = app.field('node');
  if (Array.isArray(data) && data.length > 0) {
    const item = data[0];
    if (item.url) {
      returnValue.url = item.url;
    }
    if (item.domain) {
      returnValue.domain = item.domain;
    }
    if (item.lang) {
      returnValue.lang = item.lang;
    }
    if (item.url) {
      returnValue.url = item.url;
    }
    if (item.title) {
      returnValue.title = isElement(item.title)
        ? nodeText(item.title)
        : item.title;
    }
  }
  const container = app.field('container');
  if (isElement(container)) {
    const pages = container.querySelector('.pages');
    if (isElement(pages)) {
      returnValue.content = pages;
      const title = pages.querySelector('.page .title');
      if (isElement(title)) {
        returnValue.title = nodeText(title);
      }
    }
  }
  if (exportFromDOMOrString) {
    // @ts-ignore
    if (isString(exportFromDOMOrString) && exportFromDOMOrString.length > 0) {
      const tmp = document.createElement('div');
      // @ts-ignore
      tmp.innerHTML = exportFromDOMOrString;
      returnValue.content = tmp;
    } else if (isElement(exportFromDOMOrString)) {
      // @ts-ignore
      returnValue.content = exportFromDOMOrString;
    }
  }
  if (format && isElement(returnValue.content)) {
    returnValue.content = formatNode(app, returnValue.content);
  }
  return returnValue;
}
