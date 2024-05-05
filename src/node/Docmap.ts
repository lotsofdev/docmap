import type { IDocblockSettings } from '@lotsof/docblock';
import __Docblock from '@lotsof/docblock';
import { __composerJsonSync } from '@lotsof/sugar/composer';
import {
  __checkPathWithMultipleExtensions,
  __fileName,
  __folderPath,
  __readJsonSync,
  __writeFileSync,
} from '@lotsof/sugar/fs';

import { __writeJsonSync } from '@lotsof/sugar/fs';

import {
  __deepFilter,
  __deepMap,
  __deepMerge,
  __get,
  __set,
  __sort,
  __sortDeep,
} from '@lotsof/sugar/object';

import __defaults from './defaults.js';

import { __packageJsonSync, __packageMetasSync } from '@lotsof/sugar/package';
import { __packageRootDir } from '@lotsof/sugar/path';
import { globSync as __globSync } from 'glob';

import { __namespaceCompliant } from '@lotsof/sugar/string';
import __fs from 'fs';
import __micromatch from 'micromatch';
import __path from 'path';

function __toLowerCase(l = '') {
  return l.toLowerCase();
}

import type {
  IDocmap,
  IDocmapBuildParams,
  IDocmapEntries,
  IDocmapEntry,
  IDocmapMenuObj,
  IDocmapObj,
  IDocmapReadParams,
  IDocmapSearchParams,
  IDocmapSearchResult,
  IDocmapSettings,
  IDocmapTagProxyFn,
} from './types';

/**
 * @name                Docmap
 * @namespace           node
 * @type                Class
 * @platform            node
 * @status              beta
 *
 * This class represent the ```docmap.json``` file and allows you to build it from some sources (glob pattern(s))
 * and save it inside a directory you choose.
 *
 * @param           {Object}        [settings={}]           An object of settings to configure your docmap instance
 *
 * @setting         {Record<String, IDocmapCustomMenuSettingFn>}       [customMenu={}]         Specify some custom menus you want to extract from the docmap.
 * @setting         {Record<String, IDocmapTagProxyFn>}                [tagsProxy={}]          Specify some tags proxy to transform some tags values at BUILD process.
 *
 * @todo      interface
 * @todo      doc
 * @todo      tests
 *
 * @snippet         __Docmap($1)
 * new __Docmap($1)
 *
 * @example             js
 * import __Docmap from '@lotsof/s-docmap';
 * const docmap = new __Docmap();
 * await docmap.read();
 *
 * @since           2.0.0
 * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
 */

class Docmap implements IDocmap {
  static _cachedDocmapJson = {};

  static _registeredTagsProxy = {};
  /**
   * @name           registerTagProxy
   * @type            Function
   * @static
   *
   * This static method allows you to register a tag proxy for all the Docmap instances
   *
   * @param               {String}            tag           The tag you want to proxy
   * @param               {IDocmapTagProxyFn}      processor       The processor function
   *
   * @since           2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  static registerTagProxy(tag: string, processor: IDocmapTagProxyFn): any {
    this._registeredTagsProxy[tag] = processor;
  }

  /**
   * @name          settings
   * @type         IDocmapSettings
   * @public
   *
   * Store the settings
   *
   * @since      2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  settings: IDocmapSettings;

  /**
   * @name          _entries
   * @type           IDocmapEntries
   * @private
   *
   * This store the docmap.json entries
   *
   * @since         2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  _entries: IDocmapEntries = {};

  /**
   * @name    _docmapJson
   * @type    Object
   * @private
   *
   * Store the docmap readed with the method "read"
   *
   * @since       2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  _docmapJson: any;

  /**
   * @name            constructor
   * @type            Function
   * @constructor
   *
   * Constructor
   *
   * @since       2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  constructor(settings?: Partial<IDocmapSettings>) {
    this.settings = __deepMerge(__defaults.settings, settings ?? {});
    // @ts-ignore
    this.settings.tagsProxy = {
      // @ts-ignore
      ...this.constructor._registeredTagsProxy,
      ...this.settings.tagsProxy,
    };
  }

  /**
   * @name          read
   * @type          Function
   * @async
   *
   * This method allows you to search for docmap.json files and read them to get
   * back the content of them in one call. It can take advantage of the cache if
   *
   * @todo      update documentation
   * @todo      integrate the "cache" feature
   *
   * @param       {IDocmapReadParams}            [params=null]       An IDocmapReadParams object to configure your read process
   * @return      {Promise<IDocmapObj>}                          A promise instance that will be resolved once the docmap.json file(s) have been correctly read
   *
   * @since       2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  read(params?: Partial<IDocmapReadParams>): Promise<IDocmapObj> {
    return new Promise(async (resolve) => {
      const finalParams: IDocmapReadParams = __deepMerge(
        __defaults.read,
        params ?? {},
      );

      let docmapVersion = 'current';

      // @ts-ignore
      if (this.constructor._cachedDocmapJson[docmapVersion]) {
        return resolve(
          // @ts-ignore
          this.constructor._cachedDocmapJson[docmapVersion],
        );
      }

      let docmapRootPath = __folderPath(finalParams.input);

      if (!__fs.existsSync(finalParams.input)) {
        return resolve({
          map: {},
          menu: {},
        });
      }

      const packageMonoRoot = __packageRootDir(process.cwd(), {
        highest: true,
      });

      const finalDocmapJson: IDocmapObj = {
        map: {},
        menu: {},
      };

      const loadJson = async (
        packageNameOrPath,
        type: 'npm' | 'composer' = 'npm',
        isDependency = false,
      ) => {
        let currentPathDocmapJsonPath,
          potentialPackageDocmapJsonPath = __path.resolve(
            docmapRootPath,
            type === 'npm' ? 'node_modules' : 'vendor',
            packageNameOrPath,
            'docmap.json',
          ),
          potentialRootPackageDocmapJsonPath = __path.resolve(
            packageMonoRoot,
            type === 'npm' ? 'node_modules' : 'vendor',
            packageNameOrPath,
            'docmap.json',
          );

        if (__fs.existsSync(potentialPackageDocmapJsonPath)) {
          currentPathDocmapJsonPath = potentialPackageDocmapJsonPath;
        } else if (__fs.existsSync(`${packageNameOrPath}/docmap.json`)) {
          currentPathDocmapJsonPath = `${packageNameOrPath}/docmap.json`;
        } else if (__fs.existsSync(potentialRootPackageDocmapJsonPath)) {
          currentPathDocmapJsonPath = potentialRootPackageDocmapJsonPath;
        } else {
          return;
        }

        const packageRootPath = currentPathDocmapJsonPath.replace(
          '/docmap.json',
          '',
        );

        // read the docmap file
        const docmapJson = __readJsonSync(currentPathDocmapJsonPath);

        // get package metas
        const packageMetas = __packageMetasSync(packageRootPath);
        Object.keys(docmapJson.map).forEach((namespace) => {
          if (docmapJson.map[namespace]) {
            docmapJson.map[namespace].isDependency = isDependency;
            docmapJson.map[namespace].package = packageMetas;
          }
        });
        Object.keys(docmapJson.generated?.map ?? []).forEach((namespace) => {
          if (docmapJson.generated.map[namespace]) {
            docmapJson.generated.map[namespace].isDependency = isDependency;
            docmapJson.generated.map[namespace].package = packageMetas;
          }
        });

        // add the readed docmap to the existing one
        docmapJson.map = {
          ...(docmapJson.map ?? {}),
          ...(docmapJson.generated?.map ?? {}),
        };

        // clean
        delete docmapJson.generated;

        // resolve the actual docmap "path"
        for (let i = 0; i < Object.keys(docmapJson.map).length; i++) {
          const namespace = Object.keys(docmapJson.map)[i];
          const obj = docmapJson.map[namespace];

          obj.path = __path.resolve(packageRootPath, obj.relPath);

          // checking ".dev...."
          let ext = obj.relPath.split('.').pop();
          obj.path =
            __checkPathWithMultipleExtensions(obj.path, [`dev.${ext}`, ext]) ??
            obj.path;

          docmapJson.map[namespace] = obj;
        }

        for (let [namespace, docmapObj] of Object.entries(docmapJson.map)) {
          let blockId = namespace;
          if (!finalDocmapJson.map[blockId]) {
            const docmapEntry: IDocmapEntry = docmapObj as IDocmapEntry;

            // assigning an id to the block.
            // This id is the string used as map property to store the block
            docmapEntry.id = blockId;
            // saving the block into our final docmap map
            finalDocmapJson.map[blockId] = docmapEntry;
          }
        }
      };

      // load package docmap
      const docmapJsonFolderPath = __folderPath(finalParams.input);
      await loadJson(docmapJsonFolderPath);

      // load npm dependencies docmap
      if (finalParams.dependencies) {
        const docmapPackageJson = __packageJsonSync(docmapJsonFolderPath);
        const packageJsonDeps = {
          ...(docmapPackageJson.dependencies ?? {}),
          ...(docmapPackageJson.devDependencies ?? {}),
        };
        for (let [depName, depVersion] of Object.entries(packageJsonDeps)) {
          await loadJson(depName, 'npm', true);
        }
      }

      // load composer dependencies
      const docmapComposerJson = __composerJsonSync(docmapJsonFolderPath);

      if (finalParams.dependencies) {
        const composerJsonDeps = {
          ...(docmapComposerJson?.require ?? {}),
          ...(docmapComposerJson?.requireDev ?? {}),
        };
        for (let [depName, depVersion] of Object.entries(composerJsonDeps)) {
          await loadJson(depName, 'composer', true);
        }
      }

      // save the docmap json
      this._docmapJson = finalDocmapJson;

      // extract the menu
      finalDocmapJson.menu = this._extractMenu(finalDocmapJson);

      // cache it in memory
      // @ts-ignore
      this.constructor._cachedDocmapJson[docmapVersion] = finalDocmapJson;

      // sorting
      finalParams.sort.forEach((dotPath) => {
        const toSort = __get(finalDocmapJson, dotPath);
        if (!toSort) return;
        __set(
          finalDocmapJson,
          dotPath,
          __sort(toSort, (a, b) => {
            return a.key.localeCompare(b.key);
          }),
        );
      });
      finalParams.sortDeep.forEach((dotPath) => {
        const toSort = __get(finalDocmapJson, dotPath);
        if (!toSort) return;
        __set(
          finalDocmapJson,
          dotPath,
          __sortDeep(toSort, (a, b) => {
            return a.key.localeCompare(b.key);
          }),
        );
      });

      // add the "parseDocblocksFromSourceFile" to each elements
      for (let [id, docmapObj] of Object.entries(finalDocmapJson.map)) {
        if (docmapObj.path) {
          docmapObj.parseDocblocksFromSourceFile = async (
            settings?: IDocblockSettings,
          ) => {
            const docblock = new __Docblock(docmapObj.path, settings);
            await docblock.parse();
            return docblock.toObject();
          };
        }
      }

      // return the final docmap
      resolve(finalDocmapJson);
    });
  }

  /**
   * @name          search
   * @type          Function
   *
   * This methodallows you to search for an docmap item by it's slug.
   * You can specify if you want to search also in the "packages" section or not
   *
   * @param           {IDocmapSearchParams}      params          Some params to configure your search
   * @return        {IDocmapSearchResult}                        The result of your search
   *
   * @since       2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  search(params?: Partial<IDocmapSearchParams>): Promise<IDocmapSearchResult> {
    return new Promise(async (resolve) => {
      const finalParams: IDocmapSearchParams = __deepMerge({}, params ?? {});

      const docmapJson = await this.read(finalParams);

      const result: IDocmapSearchResult = {
        search: finalParams,
        items: {},
      };

      for (let [key, item] of Object.entries(docmapJson.map)) {
        let itemMatch = true;

        const props = ['type', 'id', 'slug', 'namespace'];
        for (let i = 0; i < props.length; i++) {
          const prop = props[i];

          if (finalParams[prop] === undefined) {
            continue;
          }

          if (item[prop] === undefined) {
            itemMatch = false;
            break;
          }

          let valueToCheck = item[prop];
          if (prop === 'type') {
            // @ts-ignore
            valueToCheck = item.type?.raw ?? item.type;
          }

          if (finalParams[prop].match(/^\/.*\/$/)) {
            itemMatch = new RegExp(finalParams[prop].slice(1, -1)).test(
              valueToCheck.toLowerCase(),
            );
          } else {
            itemMatch = __micromatch.isMatch(
              valueToCheck.toLowerCase(),
              finalParams[prop].toLowerCase(),
            );
          }

          if (!itemMatch) {
            break;
          }
        }

        if (itemMatch) {
          result.items[item.id] = item;
        }
      }

      resolve(result);
    });
  }

  /**
   * @name          extractMenu
   * @type          Function
   *
   * This method allows you to extract the docmap items that have a "menu" array property and
   * return all of these in a structured object
   *
   * @return        {Record<string: SFile>}       The structured menu tree with an SFile instance attached for each source file
   *
   * @since       2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  _extractMenu(
    docmapJson: Partial<IDocmapObj> = this._docmapJson,
  ): IDocmapMenuObj {
    const docmapJsonMenuByPackage = {};

    // split menus by packages
    // @ts-ignore
    Object.keys(docmapJson.map).forEach((namespace) => {
      // @ts-ignore
      const docmapObj = docmapJson.map[namespace];
      if (!docmapObj.menu) return;
      if (!docmapJsonMenuByPackage[docmapObj.package.name]) {
        docmapJsonMenuByPackage[docmapObj.package.name] = [];
      }
      docmapJsonMenuByPackage[docmapObj.package.name].push(docmapObj);
    });

    let finalMenu: IDocmapMenuObj = {
      packages: {},
      tree: {},
      slug: {},
      custom: {},
    };
    const packageJson = __packageJsonSync();

    Object.keys(docmapJsonMenuByPackage).forEach((packageName) => {
      const menuObj = this._extractMenuFromDocmapJsonStack(
        docmapJsonMenuByPackage[packageName],
      );

      if (packageName === packageJson.name) {
        finalMenu = {
          ...finalMenu,
          ...menuObj,
        };
      } else {
        const scopedSlugMenu = {};
        Object.keys(menuObj.slug).forEach((slug) => {
          scopedSlugMenu[`/package/${packageName}${slug}`] = {
            ...menuObj.slug[slug],
            slug: `/package/${packageName}${slug}`,
          };
        });
        // @ts-ignore
        finalMenu.packages[packageName] = {
          name: packageName,
          tree: __deepMap(menuObj.tree, ({ prop, value }) => {
            if (prop === 'slug') return `/package/${packageName}${value}`;
            return value;
          }),
          slug: scopedSlugMenu,
        };
      }
    });

    Object.keys(this.settings.customMenu).forEach((menuName) => {
      if (!finalMenu.custom[menuName]) finalMenu.custom[menuName] = {};
      // @ts-ignore
      finalMenu.custom[menuName].tree = __deepFilter(
        finalMenu.tree,
        // @ts-ignore
        this.settings.customMenu[menuName],
      );
      // @ts-ignore
      finalMenu.custom[menuName].slug = __deepFilter(
        finalMenu.slug,
        // @ts-ignore
        this.settings.customMenu[menuName],
      );

      Object.keys(finalMenu.packages).forEach((packageName) => {
        const packageObj = finalMenu.packages[packageName];
        // @ts-ignore
        const packageFilteredTree = __deepFilter(
          packageObj.tree,
          // @ts-ignore
          this.settings.customMenu[menuName],
        );
        finalMenu.custom[menuName].tree = __deepMerge(
          finalMenu.custom[menuName].tree,
          packageFilteredTree,
        );
        // @ts-ignore
        const packageFilteredSlug = __deepFilter(
          packageObj.slug,
          // @ts-ignore
          this.settings.customMenu[menuName],
        );
        finalMenu.custom[menuName].slug = __deepMerge(
          finalMenu.custom[menuName].slug,
          packageFilteredSlug,
        );
      });
    });

    // @ts-ignore
    return finalMenu;
  }

  _extractMenuFromDocmapJsonStack(docmapJsonMap) {
    const menuObj = {},
      menuObjBySlug = {},
      menuObjByPackage = {};

    // extract menus
    Object.keys(docmapJsonMap).forEach((namespace) => {
      const docmapObj = docmapJsonMap[namespace];

      if (!docmapObj.menu) return;

      const dotPath = docmapObj.menu.tree
        .map((l) => {
          return __toLowerCase(l);
        })
        .join('.');

      let currentObj = menuObj;

      dotPath.split('.').forEach((part, i) => {
        if (!currentObj[part]) {
          currentObj[part] = {
            name: docmapObj.menu.tree[i],
          };
        }

        if (i >= dotPath.split('.').length - 1) {
          currentObj[part][docmapObj.name] = {
            name: docmapObj.name,
            as: docmapObj.as,
            slug: docmapObj.menu.slug,
            tree: docmapObj.menu.tree,
            // docmap: docmapObj
          };
          menuObjBySlug[docmapObj.menu.slug] = {
            name: docmapObj.name,
            as: docmapObj.as,
            slug: docmapObj.menu.slug,
            tree: docmapObj.menu.tree,
            docmap: docmapObj,
          };
        }

        currentObj = currentObj[part];
      });
    });

    return {
      tree: menuObj,
      slug: menuObjBySlug,
    };
  }

  /**
   * @name          build
   * @type          Function
   *
   * This method allows you to specify one or more glob patterns to scan files for "@namespace" docblock tags
   * and extract all the necessary informations to build the docmap.json file
   *
   * @param         {Partial<IDocmapBuildParams>}          params        The params to use to build your docmap
   * @return        {Promise}                                     A promise resolved once the scan process has been finished
   *
   * @since         2.0.0
   * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
   */
  build(params: Partial<IDocmapBuildParams>): Promise<any> {
    const finalParams: IDocmapBuildParams = __deepMerge(
      __defaults.build,
      params,
    );

    return new Promise(async (resolve) => {
      let docmapJson = {
        map: {},
        generated: {
          map: {},
        },
      };

      const packageRoot = __packageRootDir();
      const packageMonoRoot = __packageRootDir(process.cwd(), {
        highest: true,
      });

      // check if a file already exists
      if (__fs.existsSync(`${packageRoot}/docmap.json`)) {
        const currentDocmapJson = __readJsonSync(`${packageRoot}/docmap.json`);
        docmapJson = currentDocmapJson;
        docmapJson.generated = {
          map: {},
        };
      }

      console.log(
        `<yellow>[build]</yellow> Building map by searching for files inside the current package`,
      );

      // searching inside the current package for docblocks to use
      const filesInPackage = __globSync(finalParams.globs, {
        cwd: packageRoot,
        ignore: finalParams.exclude,
      });

      console.log(
        `<yellow>[build]</yellow> Found <cyan>${filesInPackage.length}</cyan> file(s) to parse in package`,
      );

      for (let i = 0; i < filesInPackage.length; i++) {
        const filePath = filesInPackage[i];

        console.log(
          `<yellow>[build]</yellow> Parsing file "<cyan>${__path.relative(
            __packageRootDir(),
            // @ts-ignore
            filePath,
          )}</cyan>"`,
        );

        const docblocksInstance = new __Docblock(filePath, {
          renderMarkdown: false,
          filepath: filePath,
        });

        await docblocksInstance.parse();

        const docblocks = docblocksInstance.toObject();

        if (!docblocks || !docblocks.length) continue;

        let docblockObj: any = {};
        const children: any = {};
        for (let j = 0; j < docblocks.length; j++) {
          const docblock = docblocks[j];

          let matchFilters = false;

          for (
            let k = 0;
            // @ts-ignore
            k < Object.keys(finalParams.excludeByTags).length;
            k++
          ) {
            const key = Object.keys(finalParams.excludeByTags)[k];
            let filterRegs =
              // @ts-ignore
              finalParams.excludeByTags[key];
            if (!Array.isArray(filterRegs)) {
              filterRegs = [filterRegs];
            }

            // @ts-ignore
            let value = docblock[key];

            // do not take care of undefined value
            if (value === undefined) continue;

            // if the "toString" method is a custom one
            // calling it to have the proper string value back
            if (
              typeof value !== 'string' &&
              value.toString?.() !== '[object Object]'
            ) {
              value = value.toString();
            }

            // check if the value match the filter or not
            // if not, we do not take the docblock
            if (typeof value === 'string') {
              filterRegs.forEach((reg) => {
                if (value.match(reg)) {
                  matchFilters = true;
                } else {
                }
              });
              if (matchFilters) {
                break;
              }
            }
          }

          // exclude this item if match any of the excludeByTags filters
          if (matchFilters) {
            continue;
          }

          if (docblock.name && docblock.name.slice(0, 1) === '_') continue;
          if (docblock.private) continue;

          // const path = __path.relative(outputDir, filepath);
          const filename = __fileName(filePath);

          const docblockEntryObj: IDocmapEntry = {
            id: 'undefined',
          };

          for (let l = 0; l < finalParams.tags.length; l++) {
            const tag = finalParams.tags[l];
            if (docblock[tag] === undefined) continue;
            // props proxy
            if (this.settings.tagsProxy[tag]) {
              docblockEntryObj[tag] = await this.settings.tagsProxy[tag](
                docblock[tag],
              );
            } else {
              docblockEntryObj[tag] = docblock[tag];
            }
          }

          const dotPath = __namespaceCompliant(
            `${docblock.namespace}.${docblock.name}`,
          );

          if (docblock.namespace && !this._entries[dotPath]) {
            docblockObj = {
              ...docblockEntryObj,
              filename,
              extension: filename.split('.').slice(1)[0],
              relPath: __path.relative(__packageRootDir(), filePath),
            };
            this._entries[dotPath] = docblockObj;
          } else if (docblock.name) {
            children[__toLowerCase(docblock.name)] = docblockEntryObj;
          }
        }
        docblockObj.children = children;
      }

      console.log(
        `<yellow>[build]</yellow> <green>${
          Object.keys(this._entries).length
        }</green> entries gathered for this docmap`,
      );

      // save entries inside the json map property
      docmapJson.generated.map = this._entries;

      if (finalParams.save) {
        if (finalParams.outDir) {
          for (let [namespace, docmapObj] of Object.entries(
            docmapJson.generated.map,
          )) {
            let outPath = `${__path.resolve(
              finalParams.outDir,
              docmapObj.id.replace(/\./gm, '/'),
            )}.json`;
            // mdx
            if (finalParams.mdx) {
              // update outpath
              outPath = outPath.replace(/\.json$/, '.mdx');

              // transform to mdx
              const mdx = this.toMdx(docmapObj);
              __writeFileSync(outPath, mdx);
            } else {
              __writeJsonSync(outPath, docmapObj);
            }

            console.log(
              `<green>[save]</green> File saved <green>successfully</green> under "<cyan>${outPath.replace(
                __packageRootDir() + '/',
                '',
              )}</cyan>"`,
            );
          }
        } else if (finalParams.outPath) {
          console.log(
            `<green>[save]</green> File saved <green>successfully</green> under "<cyan>${finalParams.outPath.replace(
              __packageRootDir() + '/',
              '',
            )}</cyan>"`,
          );
          __fs.writeFileSync(
            finalParams.outPath,
            JSON.stringify(docmapJson, null, 4),
          );
        }
      }

      resolve(docmapJson);
    });
  }

  toMdx(docmapObj: IDocmapObj): string {
    const result: string[] = [];

    result.push('<div class="docmap-mdx">');

    result.push(`# ${docmapObj.name}`);
    result.push(`<div class="_namespace">${docmapObj.namespace}</div>`);

    if (docmapObj.status || docmapObj.since) {
      result.push('<div class="_metas">');
    }

    if (docmapObj.status) {
      result.push(
        `<div class="_status"><span class="_status-label">Status:</span><span class="_status-value -${docmapObj.status}">${docmapObj.status}</span></div>`,
      );
    }
    if (docmapObj.since) {
      result.push(
        `<div class="_since"><span class="_since-label">Since:</span><span class="_since-value">${docmapObj.since}</span></div>`,
      );
    }

    if (docmapObj.status || docmapObj.since) {
      result.push('</div>');
    }

    if (docmapObj.description) {
      result.push('<div class="_description">');
      result.push(docmapObj.description);
      result.push('</div>');
    }

    if (docmapObj.param) {
      result.push('<div class="_params">');
      result.push('## Params');

      Object.entries(docmapObj.param).forEach(([id, paramObj], i) => {
        result.push(
          `${i + 1}. <span class="_name">${paramObj.name}${
            paramObj.default === undefined
              ? '<span class="_required">*</span>'
              : ''
          }</span><span class="_default">${
            paramObj.default ?? ''
          }</span> <span class="_type">${paramObj.type.raw}</span>`,
        );
        result.push(`   - ${paramObj.description}`);
      });
      result.push('</div>');
    }

    if (docmapObj.return) {
      result.push('<div class="_return">');

      result.push(`## Return`);
      result.push(
        `- <span class="_description">${
          docmapObj.return.description
        }</span><span class="_default">${
          docmapObj.return.default ?? ''
        }</span><span class="_type">${docmapObj.return.type.raw}</span>`,
      );

      result.push('</div>');
    }

    if (docmapObj.example) {
      result.push('<div class="_examples">');

      result.push('## Examples');
      docmapObj.example.forEach((exampleObj) => {
        result.push(`\`\`\`${exampleObj.language}
${exampleObj.code}
\`\`\``);
      });

      result.push('</div>');
    }

    if (docmapObj.setting) {
      result.push('<div class="_settings">');

      result.push('## Settings');
      Object.entries(docmapObj.setting).forEach(([id, settingObj], i) => {
        result.push(
          `${i + 1}. <span class="_name">${settingObj.name}${
            settingObj.default === undefined
              ? '<span class="_required">*</span>'
              : ''
          }</span><span class="_default">${
            settingObj.default ?? ''
          }</span> <span class="_type">${settingObj.type.raw}</span>`,
        );
      });

      result.push('</div>');
    }

    if (docmapObj.author) {
      result.push('<div class="_author">');
      result.push(`<span class="_name">${docmapObj.author.name}</span>`);
      result.push(`<span class="_email">${docmapObj.author.email}</span>`);
      result.push(
        `<a href="${docmapObj.author.url}" target="_blank" class="_url">${docmapObj.author.url}</a>`,
      );
      result.push('</div>');
    }

    result.push('</div>');

    return result.join('\n');
  }
}

export default Docmap;
