// @ts-nocheck
import __SInterface from '@coffeekraken/s-interface';
import __SDocmapReadParamsInterface from './SDocmapReadParamsInterface';
/**
 * @name                SDocmapReadParamsInterface
 * @namespace           node.interface
 * @type                      Class
 * @extends             SInterface
 * @interface
 * @status              beta
 * @platform             node
 *
 * This class represent the interface that describe the minimum requirement
 * needed to build the docMap.json file
 *
 * @since       2.0.0
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
 */
class SDocmapReadParamsInterface extends __SInterface {
    static get _definition() {
        return Object.assign(Object.assign({}, __SDocmapReadParamsInterface.definition), { slug: {
                description: 'Specify a slug to search for. Can be a micromatch glob as well',
                type: 'String',
                alias: 's',
            }, namespace: {
                description: 'Specify a namespace to search for. Can be a micromatch glob as well',
                type: 'String',
                alias: 'n',
            } });
    }
}
export default SDocmapReadParamsInterface;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWM7QUFFZCxPQUFPLFlBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUNyRCxPQUFPLDRCQUE0QixNQUFNLDhCQUE4QixDQUFDO0FBRXhFOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSwwQkFBMkIsU0FBUSxZQUFZO0lBQ2pELE1BQU0sS0FBSyxXQUFXO1FBQ2xCLHVDQUNPLDRCQUE0QixDQUFDLFVBQVUsS0FDMUMsSUFBSSxFQUFFO2dCQUNGLFdBQVcsRUFDUCxnRUFBZ0U7Z0JBQ3BFLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxHQUFHO2FBQ2IsRUFDRCxTQUFTLEVBQUU7Z0JBQ1AsV0FBVyxFQUNQLHFFQUFxRTtnQkFDekUsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsS0FBSyxFQUFFLEdBQUc7YUFDYixJQUNIO0lBQ04sQ0FBQztDQUNKO0FBQ0QsZUFBZSwwQkFBMEIsQ0FBQyJ9