/**
 * @name            interfaceTagProxy
 * @namespace       node.tagsProxy
 * @type                Function
 * @platform        node
 * @status          beta
 *
 * This field proxy take the "interface" field and transform it to full
 * interface with props etc...
 *
 * @param       {any}           data        The interface data to process
 * @return      {ISDocmapInterfaceField}            The full interface data
 *
 * @since       2.0.0
 * @author         Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
 */

export interface ISDocmapInterfaceField {}

export default async function interfaceTagProxy(
    data: any,
): Promise<ISDocmapInterfaceField> {
    const int = (await import(data.path)).default;
    return int.toObject();
}
