export function isType(value: any, type: string) {
  return Object.prototype.toString.call(value) === `[object ${type}]`;
}

export function isUndefined(value: any) {
  return isType(value, 'Undefined');
}

export function isString(value: any) {
  return isType(value, 'String');
}

export function isElement(value: any) {
  return value && value.nodeType && value.nodeType === 1;
}

export function isNumber(value: any) {
  return isType(value, 'Number');
}

export function isFunction(value: any) {
  return isType(value, 'Function');
}

export function isBoolean(value: any) {
  return isType(value, 'Boolean');
}

export function isObject(value: any) {
  return isType(value, 'Object');
}

export function isAsyncFunction(value: any) {
  return isType(value, 'AsyncFunction');
}

export function isChinese(value: string) {
  return /[\u4e00-\u9fa5]/.test(value);
}
