// @ts-nocheck

import __SInterface from '@coffeekraken/s-interface';

/**
 * @name                SDocmapSettingsInterface
 * @namespace           node.interface
 * @type                      Class
 * @extends             SInterface
 * @interface
 * @status              beta
 * @platform             node
 *
 * This class represent the interface that describe SDocmap settings
 *
 * @since       2.0.0
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
 */
class SDocmapSettingsInterface extends __SInterface {
    static get _definition() {
        return {
            customMenu: {
                description:
                    'Specify some custom menu to generate for the docmap.',
                type: 'Object',
                default: {},
            },
            tagsProxy: {
                description:
                    'Specify some proxy by tags. A proxy is a function that will be called with the corresponding tag data and return new data for the docmap.json file.',
                type: 'Object',
                default: {},
            },
        };
    }
}
export default SDocmapSettingsInterface;
