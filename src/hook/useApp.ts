import { useContext } from 'react';
import AppContext from './index';
import { App, Plugin } from '../interface';

export default function useApp() {
  return useContext(AppContext) as {
    app: App;
    me: Plugin;
    root: HTMLElement;
    shadow: ShadowRoot;
    container: HTMLElement;
  };
}
