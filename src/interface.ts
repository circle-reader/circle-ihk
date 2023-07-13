export interface App {
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

  get: (key: string, table?: string) => Promise<any>;
  set: (
    key: string | Array<IData>,
    value?: IData,
    table?: string
  ) => Promise<any>;
  remove: (key: string | Array<string>, table?: string) => Promise<any>;
  list: (query?: Query, pager?: Pager, origin?: boolean) => Promise<any>;
  option: (key: string, value?: IData) => Promise<any>;

  warn: (...args: Array<string>) => void;
  info: (...args: Array<string>) => void;
  error: (...args: Array<string>) => void;
  success: (...args: Array<string>) => void;

  download: (id: string) => Promise<Plugin>;
  listApp: (match?: Match, pager?: Pager) => Promise<any>;
  getApp: (id: string, runtime?: boolean) => Promise<Plugin>;
  setApp: (plugin: Plugin) => Promise<Plugin>;
  enable: (id: string) => Promise<boolean>;
  disable: (id: string) => Promise<boolean>;
  install(data: string | Plugin): Promise<boolean>;
  uninstall: (id: string) => Promise<boolean>;
  used: (id: string) => boolean;
  run: (id: string) => Promise<boolean>;
  destroy: (id: string) => Promise<boolean>;
  apply: (runAt: string) => Promise<boolean>;

  i18n: (...args: Array<string>) => string;

  data: (key: string, value?: any, notMerge?: boolean) => any;
  path: (id?: string) => string;

  send: (
    type: string,
    option?: any,
    callback?: (error?: string, data?: any) => void
  ) => void;
  fetch: (
    url: string,
    options?: {
      format?: 'json' | 'text';
      [index: string]: any;
    }
  ) => Promise<any>;

  on: (
    name: string,
    callback: string | any,
    once?: boolean,
    priority?: number
  ) => () => void;
  fire: (name: string, ...args: any) => void;
  addFilter: (
    name: string | string[],
    callback: string | any,
    once?: boolean,
    priority?: number
  ) => () => void;
  applyFilter: (name: string, ...args: any[]) => any;
  hasHook: (name: string) => boolean;
  removeHook: (name: string | string[], callback?: () => void) => void;
}

export interface Plugin {
  id: string;
  type?: string;
  title?: string;
  runAt?: string;
  version?: string;
  priority?: number;
  description?: string;
  author?: string;
  debug?: boolean;
  access?: boolean;
  homepage?: string;
  dependencies?: string[];
  main?: string;
  option?: {
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
