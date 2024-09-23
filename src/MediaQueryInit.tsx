import { MediaQueryMap } from './MediaQueries.types';
import React from 'react';
import { MediaQueryContextProvider } from './MediaQueryContextProvider';
import { useMediaQueryContext } from './MediaQueryContext';

export function MediaQueryInit<_MapType extends MediaQueryMap>(
    queries: _MapType,
    { log = false }: { log?: boolean } = {},
) {
    const Provider = ({ children }: { children?: React.ReactElement }) => (
        <MediaQueryContextProvider queries={queries} log={log}>
            {children}
        </MediaQueryContextProvider>
    );

    return {
        Provider,
        use() {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            return useMediaQueryContext<_MapType>();
        },
    };
}
