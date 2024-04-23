// @ts-nocheck

import __SDocmap from '../node/SDocmap.js';

export default (stringArgs = '') => {
    return new Promise(async (resolve) => {
        const docmap = new __SDocmap();
        const result = await docmap.build(stringArgs);
        resolve(result);
    });
};
