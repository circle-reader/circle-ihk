export interface App {
  version: string;
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
    value?: any,
    table?: string
  ) => Promise<any>;
  remove: (key: string | Array<string>, table?: string) => Promise<any>;
  list: (query?: Query, pager?: Pager, table?: string) => Promise<any>;
  option: (key: string, value?: any) => Promise<any>;
  keyboard(event: KeyboardEvent): string | undefined;

  warn: (...args: Array<string>) => void;
  info: (...args: Array<string>) => void;
  error: (...args: Array<string>) => void;
  success: (...args: Array<string>) => void;

  apply: (runAt: string) => Promise<boolean>;

  i18n: (...args: Array<any>) => string;

  data(key: string, value?: any, notMerge?: boolean): any;
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
  fire(id: string, ...args: any): void;
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
  core?: boolean;
  enabled?: boolean;
  version?: string;
  preset?: boolean;
  priority?: number;
  description?: string;
  author?: string;
  debug?: boolean;
  isPro?: boolean;
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
