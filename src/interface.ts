export interface User {
  uid: string;
  name?: string;
  expire?: string;
  avatar?: string;
  mail?: string;
  roles: Array<string>;
  access_token?: string;
}

export interface Plugin {
  id: string;
  type?: string;
  title?: string;
  runAt?: string;
  core?: boolean;
  enabled?: boolean;
  version?: string;
  priority?: number;
  description?: string;
  author?: string;
  pro?: boolean;
  homepage?: string;
  dependencies?: string[];
  main?: string;
  settings?: {
    [index: string]: any;
  };
  i18n?: {
    [index: string]: any;
  };
}

export type IData = {
  id: string;
  changed?: number;
  value: any;
  [index: string]: any;
};

export type Match = {
  [index: string]: string | boolean | Array<string>;
};

export type Query = {
  field?: string;
  keyRange?: any | Array<any>;
  searchIn?: string | Array<string>;
  search?: string;
  order?: 'DESC' | 'ASC';
  match?: Match;
};

export type Pager = {
  start: number;
  limit: number;
};

export interface App {
  version: string;
  language: string;
  device: {
    apple: {
      phone: boolean;
      ipod: boolean;
      tablet: boolean;
      universal: boolean;
      device: boolean;
    };
    amazon: {
      phone: boolean;
      tablet: boolean;
      device: boolean;
    };
    android: {
      phone: boolean;
      tablet: boolean;
      device: boolean;
    };
    windows: {
      phone: boolean;
      tablet: boolean;
      device: boolean;
    };
    other: {
      blackberry: boolean;
      blackberry10: boolean;
      opera: boolean;
      firefox: boolean;
      chrome: boolean;
      device: boolean;
    };
    phone: boolean;
    tablet: boolean;
    any: boolean;
  };
  user: User;
  getURL: (path: string) => string;
  colorScheme: {
    value: '' | 'light' | 'dark';
  };
  tables: Array<{
    table: 'apps' | 'option' | 'node';
    indexs: string | Array<string>;
    freeze: Array<string>;
  }>;
  url2json: (url: string) => any;
  path: (id?: string) => string;
  isExtPage: (url?: string) => boolean;
  field: (
    id?:
      | string
      | Array<string>
      | {
          [index: string]: any;
        },
    defaultValue?: any
  ) => any;

  data(id: string, value?: any): any;

  get: (id: string, table?: string) => Promise<any>;
  set: (id: string | Array<IData>, value?: any, table?: string) => Promise<any>;
  remove: (id: string | Array<string>, table?: string) => Promise<any>;
  list: (query?: Query, pager?: Pager, table?: string) => Promise<any>;
  option: (id?: string, value?: any) => Promise<any>;
  log: (...args: any) => string;

  action: (id?: 'ready' | 'enable' | 'disable' | 'force') => void;
  record: (value: string, type?: string) => Promise<any>;
  export: (value?: string | Array<string>) => Promise<{
    version: string;
    data: any;
  }>;
  import: (
    value:
      | string
      | {
          version?: string;
          data: any;
        },
    type?: string
  ) => Promise<any>;
  reset: (value?: string) => Promise<any>;
  contextMenus: (
    action: 'create' | 'update' | 'remove' | 'destory' | 'rebuild',
    value?:
      | string
      | {
          id: string;
          label?: string;
          checked?: boolean;
        }
      | Array<{
          id: string;
          label: string;
          priority?: number;
          checked: boolean;
          global?: boolean;
        }>
  ) => Promise<any>;
  tabs: (
    action: 'create' | 'update' | 'remove' | 'captureVisibleTab' | 'query',
    value?: any
  ) => Promise<any>;
  windows: (
    action: 'current' | 'create' | 'get' | 'update' | 'remove',
    value?:
      | number
      | {
          id?: number;
          url?: string;
          state?:
            | 'normal'
            | 'minimized'
            | 'maximized'
            | 'fullscreen'
            | 'locked-fullscreen';
          args?: any;
        }
  ) => Promise<any>;

  warning: (...args: Array<string>) => void;
  info: (...args: Array<string>) => void;
  error: (...args: Array<string>) => void;
  success: (...args: Array<string>) => void;

  syncUser: () => Promise<User>;
  cron: (force?: boolean) => Promise<boolean>;

  getApp(id: string | Plugin): Promise<Plugin>;
  listApp: (match?: Match, pager?: Pager) => Promise<Array<Plugin>>;
  enable: (id: string | Plugin) => Promise<boolean>;
  disable: (id: string | Plugin) => Promise<boolean>;
  uninstall: (id: string | Plugin) => Promise<boolean>;
  install: (id: string | Plugin) => Promise<boolean>;
  apply: (runAt: string, scope?: string) => Promise<boolean>;
  dynamicRun(id: string | Plugin): Promise<boolean>;

  i18n: (...args: Array<string>) => string;

  fetch: (
    url: string,
    options?: {
      format?: 'json' | 'text' | 'blob';
      [index: string]: any;
    }
  ) => Promise<any>;

  on: (
    id: string,
    callback: string | any,
    once?: boolean,
    priority?: number
  ) => () => void;
  fire(id: string, ...args: any): void;
  addFilter: (
    id: string | string[],
    callback: string | any,
    once?: boolean,
    priority?: number
  ) => () => void;
  applyFilter: (id: string, ...args: any[]) => any;
  hasHook: (id: string) => boolean;
  removeHook: (id: string | string[], callback?: () => void) => void;
}
