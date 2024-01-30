import each from '../utils/each';
import { App } from '../interface';
import { urlFor, nameFor } from './utils';

export function webdav(app: App, username: string, password: string) {
  const axios = (url: string, opts: any, xml?: boolean) => {
    return app
      .fetch(url, {
        ...opts,
        headers: {
          ...opts.headers,
          'Content-Type': 'text/xml; charset=UTF-8',
          Authorization: 'Basic ' + btoa(username + ':' + password),
        },
      })
      .then((result) => {
        if (xml && result) {
          const data = new window.DOMParser().parseFromString(
            result,
            'text/xml'
          );
          return Promise.resolve(
            data.firstChild?.nextSibling
              ? data.firstChild.nextSibling
              : data.firstChild
          );
        }
        return Promise.resolve(result);
      });
  };

  return {
    get(url: string) {
      return axios(url, {
        method: 'GET',
        format: 'text',
      });
    },
    propfind(url: string) {
      return axios(
        url,
        {
          method: 'PROPFIND',
          format: 'text',
          headers: {
            Depth: '1',
          },
        },
        true
      );
    },
    mkcol(url: string) {
      return axios(url, {
        method: 'MKCOL',
        format: 'text',
      });
    },
    delete(url: string) {
      return axios(url, {
        method: 'DELETE',
        format: 'text',
      });
    },
    put(url: string, data: any) {
      return axios(url, {
        data,
        method: 'PUT',
        format: 'text',
      });
    },
  };
}

export default function fs(
  app: App,
  root: string,
  user: string,
  password: string
) {
  const instance = webdav(app, user, password);

  return {
    file(href: string) {
      const url = urlFor(href, root);
      return {
        url,
        type: 'file',
        name: nameFor(url),
        read() {
          return instance.get(url);
        },
        write(data: any) {
          return instance.put(url, data);
        },
        rm() {
          return instance.delete(url);
        },
      };
    },
    dir(href: string) {
      const self = this;
      const url = urlFor(href, root);
      return {
        url,
        type: 'dir',
        name: nameFor(url),
        rm() {
          return instance.delete(url);
        },
        mkdir() {
          return instance.mkcol(url);
        },
        children() {
          return instance.propfind(url).then((doc) => {
            if (doc.childNodes == null) {
              return Promise.reject('No such directory: ' + url);
            }
            const result: Array<any> = [];
            each(doc.childNodes, (item, index) => {
              if (index <= 0) {
                // Start at 1, because the 0th is the same as self.
                return;
              }
              const href = decodeURI(
                item
                  .getElementsByTagName('d:href')[0]
                  .firstChild.nodeValue.replace(/\/$/, '')
              );
              const propstat = item.getElementsByTagName('d:propstat')[0];
              const prop = propstat.getElementsByTagName('d:prop')[0];
              const resourcetype =
                prop.getElementsByTagName('d:resourcetype')[0];
              const collection =
                resourcetype.getElementsByTagName('d:collection')[0];
              if (collection) {
                result.push(self.dir(href));
              } else {
                result.push(self.file(href));
              }
            });
            return Promise.resolve(result);
          });
        },
      };
    },
  };
}
