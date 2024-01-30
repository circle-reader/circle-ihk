import each from './each';
import { parse } from './json';
import { Plugin } from '../interface';
import { isObject, isUndefined } from './is';

export default function filterPluginField(data: { id: string; file?: string }) {
  const remotePlugin: any = isObject(data) ? data : {};
  if (!remotePlugin.file) {
    return;
  }
  const plugin: Plugin = {
    id: remotePlugin.id,
  };
  if (data.file) {
    each(parse(remotePlugin.file), (val, key) => {
      // 对字段进行限制
      if (
        [
          'id',
          'type',
          'title',
          'runAt',
          'version',
          'priority',
          'description',
          'author',
          'pro',
          'homepage',
          'dependencies',
          'main',
          'settings',
          'i18n',
        ].includes(key) &&
        !isUndefined(val)
      ) {
        // @ts-ignore
        plugin[key] = val;
      }
    });
  }
  return plugin;
}
