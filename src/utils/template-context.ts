import { App } from '../interface';
import pageNode from './page-node';
import { isElement, isString } from './is';

export default function templateContext(
  app: App,
  content?: string | HTMLElement,
  format?: boolean
): {
  [index: string]: {
    [index: string]: number | string;
  };
} {
  const pageFields = pageNode(app);
  const pageField =
    Array.isArray(pageFields) && pageFields.length > 0 ? pageFields[0] : {};
  const userFields: any = app.user;
  const userData: {
    [index: string]: string;
  } = {};
  ['uid', 'mail', 'name', 'avatar'].forEach((field) => {
    userData[field] = userFields[field] || '';
  });

  let textToReturn = '';
  let htmlToReturn = '';
  if (content) {
    // @ts-ignore
    if (isString(content) && content.length > 0) {
      // @ts-ignore
      const value = format ? content.replace(/\n+/g, '<br />') : content;
      textToReturn = value;
      htmlToReturn = value;
    } else if (isElement(content)) {
      // @ts-ignore
      textToReturn = content.innerText;
      // @ts-ignore
      htmlToReturn = content.innerHTML;
    }
  } else {
    let dataToReturn = '';
    const container = app.field('container');
    if (isElement(container)) {
      const pages = container.querySelector('.pages');
      if (isElement(pages)) {
        const temp = document.createElement('div');
        temp.innerHTML = pages.innerHTML;
        ['title', 'meta', 'excerpt', 'cover', 'footer'].forEach((key) => {
          temp.querySelectorAll(`.${key}`).forEach((item) => {
            item.parentElement?.removeChild(item);
          });
        });
        temp.querySelectorAll('.page').forEach((item) => {
          dataToReturn += item.innerHTML;
        });
      }
    }
    if (htmlToReturn.length > 0) {
      const temp = document.createElement('div');
      temp.innerHTML = htmlToReturn;
      textToReturn = temp.innerText;
      htmlToReturn = dataToReturn;
    } else {
      textToReturn = pageField.content.innerText;
      htmlToReturn = pageField.content.innerHTML;
    }
  }

  return {
    app: {
      name: app.i18n('name'),
      version: `v${app.version}`,
      description: app.i18n('description'),
    },
    user: {
      ...userData,
      url: app.path(`user/${userData.uid || 0}`),
    },
    node: {
      ...pageField,
      text: textToReturn.trim(),
      content: htmlToReturn.trim(),
      title: isElement(pageField.title)
        ? pageField.title.innerText.trim()
        : pageField.title,
      tags:
        Array.isArray(pageField.tags) && pageField.tags.length > 0
          ? pageField.tags.join(',')
          : '',
      author:
        Array.isArray(pageField.author) && pageField.author.length > 0
          ? pageField.author
              .map((author: { name: string }) => author.name)
              .join(',')
          : '',
    },
  };
}
