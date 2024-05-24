// @ts-nocheck

import type { IDocmapConfig } from './types.js';

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
      `src/!(css)/**/*.+(${__commonTextFileExtensions({}).join('|')})`,
      `dist/+(css)/*`,
    ],
    exclude: [],
    excludeByTags: {
      status: [/^(?!stable)([a-z0-9]+)$/],
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
      'author',
    ],
    save: true,
    outPath: `${process.cwd()}/docmap.json`,
    outDir: undefined,
    json: true,
    mdx: false,
  },
  search: {},
} as IDocmapConfig;
