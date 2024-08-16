// @ts-nocheck

import type { TDocmapConfig } from './types.js';

import { __commonTextFileExtensions } from '@lotsof/sugar/extension';

export default {
  settings: {
    tagsProxy: {},
    customMenu: {
      styleguide({ key, value, isObject }) {
        if (key === 'styleguide') return true;
        if (
          key.split('/').length > 1 &&
          key.match(/^([a-zA-Z0-9-_@\/]+)?\/styleguide\//)
        ) {
          return true;
        }
        return false;
      },
      specs({ key, value, isObject }) {
        if (key === 'specs') return true;
        if (
          key.split('/').length > 1 &&
          key.match(/^([a-zA-Z0-9-_@\/]+)?\/views\//)
        ) {
          return true;
        }
        return false;
      },
    },
    docblock: {},
  },
  read: {
    input: `${process.cwd()}/docmap.json`,
    dependencies: true,
    sort: [],
    sortDeep: [],
  },
  build: {
    globs: [
      '*',
      `src/**/*.+(${__commonTextFileExtensions({}).join('|')})`,
      // `dist/+(css)/*`,
    ],
    exclude: [],
    excludeByTags: {
      status: [/^(?!stable|beta)([a-z0-9]+)$/],
      type: [/^CssClass$/],
    },
    tags: [
      'id',
      'name',
      'as',
      'type',
      'param',
      'return',
      'setting',
      'menu',
      'default',
      'platform',
      'description',
      'namespace',
      'status',
      'snippet',
      'example',
      'install',
      'interface',
      'async',
      'static',
      'since',
      'todo',
      'author',
    ],
    save: true,
    outPath: `${process.cwd()}/docmap.json`,
    outDir: undefined,
    json: true,
    mdx: false,
    clear: true,
  },
  search: {},
} as TDocmapConfig;
