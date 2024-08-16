import type { TDocblockBlock, TDocblockSettings } from '@lotsof/docblock';

export type TDocmapConfig = {
  settings: TDocmapSettings;
  read: TDocmapReadParams;
  build: TDocmapBuildParams;
  search: TDocmapSearchParams;
};

export type TDocmapBuildOutPathParam =
  | string
  | ((docmapObj: TDocmapObj, settings: TDocmapSettings) => string);

export type TDocmapBuildParams = {
  globs: string[];
  exclude: string[];
  excludeByTags: Record<string, RegExp[]>;
  tags: string[];
  save: boolean;
  outPath: TDocmapBuildOutPathParam;
  outDir?: string;
  mdx?: boolean;
  json?: boolean;
  clear?: boolean;
};

export type TDocmapReadParams = {
  input: string;
  dependencies: boolean;
  sort: string[];
  sortDeep: string[];
};

export type TDocmapTagProxyFn = {
  (data: any): any;
};

export type TDocmapCustomMenuSettingFn = {
  (menuItem: TDocmapMenuObjItem): boolean;
};

export type TDocmapSettings = {
  customMenu: Record<string, TDocmapCustomMenuSettingFn>;
  tagsProxy: Record<string, TDocmapTagProxyFn>;
  docblock?: TDocblockSettings;
};

export type TDocmapEntry = {
  id: string;
  path?: string;
  name?: string;
  namespace?: string;
  filename?: string;
  extension?: string;
  relPath?: string;
  directory?: string;
  relDirectory?: string;
  type?: string;
  description?: string;
  extends?: boolean;
  static?: boolean;
  since?: string;
  status?: string;
  package?: any;
  menu?: any;
  parseDocblocksFromSourceFile?(
    settings?: TDocblockSettings,
  ): Promise<TDocblockBlock[]>;
};
export type TDocmapEntries = {
  [key: string]: TDocmapEntry;
};

export type TDocmapMenuObjItem = {
  name: any;
  slug: any;
  [key: string]: Partial<TDocmapMenuObjItem>;
};

export type TDocmapMenuObj = {
  packages: Record<string, Partial<TDocmapMenuObjItem>>;
  tree: Record<string, Partial<TDocmapMenuObjItem>>;
  slug: Record<string, Partial<TDocmapMenuObjItem>>;
  custom: Record<string, Partial<TDocmapMenuObjItem>>;
};

export type TDocmapSearchParams = {
  slug: string;
  namespace: string;
  dependencies: boolean;
  type: string;
  id: string;
};

export type TDocmapSearchResult = {
  search: Partial<TDocmapSearchParams>;
  items: TDocmapEntries;
};

export type TDocmapObj = {
  map: TDocmapEntries;
  menu: Partial<TDocmapMenuObj>;
};

export type TDocmap = {
  _entries: TDocmapEntries;
};
