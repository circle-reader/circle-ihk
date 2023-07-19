import { parse } from '../utils/json';

export default function (value: string) {
  return parse(decodeURIComponent(atob(value)));
}
