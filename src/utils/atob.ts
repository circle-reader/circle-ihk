import { parse } from './json';

export default function (value: string) {
  return parse(decodeURIComponent(atob(value)));
}
