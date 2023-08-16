export { default as AppContext } from './hook';
export { default as useApp } from './hook/useApp';
export { default as useUser } from './hook/useUser';
export { default as useData } from './hook/useData';
export { default as useQuery } from './hook/useQuery';
export { default as useOption } from './hook/useOption';

export { default as url } from './utils/url';
export { default as attr } from './utils/attr';
export { default as unix } from './utils/unix';
export { default as each } from './utils/each';
export { default as noop } from './utils/noop';
export { default as atou } from './utils/atou';
export { default as btoa } from './utils/btoa';
export { parse, stringify } from './utils/json';
export { getHash, setHash } from './utils/hash';
export { default as alert } from './utils/alert';
export { default as isTag } from './utils/istag';
export { default as style } from './utils/style';
export { default as remove } from './utils/remove';
export { default as brower } from './utils/brower';
export { default as create } from './utils/create';
export { default as zIndex } from './utils/zindex';
export { default as observe } from './utils/observe';
export { default as keyboard } from './utils/keyboard';
export { default as nodeText } from './utils/node-text';
export { default as queryTitle } from './utils/query-title';

export { User, App, Plugin, IData, Match, Query, Pager } from './interface';

export {
  isType,
  isTextNode,
  isChinese,
  isUndefined,
  isString,
  isElement,
  isNumber,
  isFunction,
  isBoolean,
  isObject,
  isAsyncFunction,
} from './utils/is';
