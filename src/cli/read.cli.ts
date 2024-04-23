// @ts-nocheck

import { __copy } from '@coffeekraken/sugar/clipboard';
import __SDocmap from '../node/SDocmap.js';

export default (stringArgs = '') => {
    return new Promise(async (resolve) => {
        const docmap = new __SDocmap();
        const result = await docmap.read(stringArgs);
        __copy(JSON.stringify(result, null, 4));
        console.log(
            `<green>[read]</green> docmap.json copied to your clipboard`,
        );
        console.log(
            `<green>[read]</green> <cyan>${
                Object.keys(result?.map ?? {}).length
            }</cyan> docmap items`,
        );
        resolve(result);
    });
};
