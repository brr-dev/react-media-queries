/*
 * @author Brandon Ramirez <brandon@brr.dev>
 * @copyright Copyright (c) 2024
 */

export type MediaQueryMap = Record<string, string | number>;
export type MediaQueryMatchMap<_MapType extends MediaQueryMap> = {
    [key in keyof _MapType]: boolean;
};
