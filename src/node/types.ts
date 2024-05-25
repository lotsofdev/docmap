import type { IDocblockSettings } from '@lotsof/docblock';

export interface IDocmapConfig {
  settings: IDocmapSettings;
  read: IDocmapReadParams;
  build: IDocmapBuildParams;
  search: IDocmapSearchParams;
}

export interface IDocmapBuildParams {
  globs: string[];
  exclude: string[];
  excludeByTags: Record<string, RegExp[]>;
  tags: string[];
  save: boolean;
  outPath: string;
  outDir?: string;
  mdx?: boolean;
  json?: boolean;
}

export interface IDocmapReadParams {
  input: string;
  dependencies: boolean;
  sort: string[];
  sortDeep: string[];
}

export interface IDocmapTagProxyFn {
  (data: any): any;
}

export interface IDocmapCustomMenuSettingFn {
  (menuItem: IDocmapMenuObjItem): boolean;
}

export interface IDocmapSettings {
  customMenu: Record<string, IDocmapCustomMenuSettingFn>;
  tagsProxy: Record<string, IDocmapTagProxyFn>;
  docblock?: IDocblockSettings;
}

export interface IDocmapEntry {
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
    settings?: IDocblockSettings,
  ): Promise<IDocblockBlock[]>;
}
export interface IDocmapEntries {
  [key: string]: IDocmapEntry;
}

export interface IDocmapMenuObjItem {
  name: any;
  slug: any;
  [key: string]: Partial<IDocmapMenuObjItem>;
}

export interface IDocmapMenuObj {
  packages: Record<string, Partial<IDocmapMenuObjItem>>;
  tree: Record<string, Partial<IDocmapMenuObjItem>>;
  slug: Record<string, Partial<IDocmapMenuObjItem>>;
  custom: Record<string, Partial<IDocmapMenuObjItem>>;
}

export interface IDocmapSearchParams {
  slug: string;
  namespace: string;
  dependencies: boolean;
  type: string;
  id: string;
}

export interface IDocmapSearchResult {
  search: Partial<IDocmapSearchParams>;
  items: IDocmapEntries;
}

export interface IDocmapObj {
  map: IDocmapEntries;
  menu: Partial<IDocmapMenuObj>;
}

export interface IDocmap {
  _entries: IDocmapEntries;
}
