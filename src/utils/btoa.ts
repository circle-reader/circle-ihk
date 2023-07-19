import { stringify } from '../utils/json';

export default function (value: any) {
  return btoa(encodeURIComponent(stringify(value)));
}
