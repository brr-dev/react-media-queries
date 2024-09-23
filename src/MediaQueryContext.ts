/*
 * @author Brandon Ramirez <brandon@brr.dev>
 * @copyright Copyright (c) 2024
 */

import React from 'react';
import { MediaQueryMap, MediaQueryMatchMap } from './MediaQueries.types';

export const MediaQueryContext = React.createContext<unknown>(undefined);

export function useMediaQueryContext<
    _MapType extends MediaQueryMap,
    MatchMap extends
        MediaQueryMatchMap<_MapType> = MediaQueryMatchMap<_MapType>,
>(): MatchMap {
    return React.useContext(MediaQueryContext) as MatchMap;
}
