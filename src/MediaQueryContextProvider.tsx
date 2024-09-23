// ! Copyright (c) 2024, Brandon Ramirez, brr.dev

import React from 'react';
import { MediaQueryMap, MediaQueryMatchMap } from './MediaQueries.types';
import { MediaQueryContext } from './MediaQueryContext';

export function MediaQueryContextProvider<_MapType extends MediaQueryMap>({
    queries,
    log = false,
    children,
}: {
    queries: _MapType;
    log?: boolean;
    children?: React.ReactElement;
}): React.ReactElement {
    // Internal helper types
    type MatchMapType = MediaQueryMatchMap<_MapType>;
    type ListenerMapType = Record<keyof typeof queries, MediaQueryList>;

    /**
     * Based on the passed-in queries, generate the following once (and on change):
     * - A list of keys from the passed-in queries object
     * - An object mapping those keys to the relevant MediaQueryList object
     * - An object mapping those keys to the initial match value of their MediaQueryList object
     */
    const [queryKeys, mediaListeners, initValue] = React.useMemo(() => {
        // Keys are the media query labels
        const _queryKeys: Array<keyof typeof queries> = Object.keys(queries);

        // Generate objects to store derived values on when we iterate the keys
        const _mediaListeners: Partial<ListenerMapType> = {};
        const _initValue: Partial<MatchMapType> = {};

        // Loop over the keys
        _queryKeys.forEach((key) => {
            // Get the value of the media query size as a string
            const queryVal = queries[key];
            const queryValStr =
                typeof queryVal === 'number' ? `${queryVal}px` : `${queryVal}`;

            // Create a new MediaQueryList based on the size string
            const mediaListener = window.matchMedia(
                `(min-width: ${queryValStr})`,
            );

            // Store the listener on the listener object
            _mediaListeners[key] = mediaListener;

            // Store the current match value on the initial value object
            _initValue[key] = mediaListener.matches;
        });

        // Cast these to non-partial types
        return [_queryKeys, _mediaListeners, _initValue] as [
            Array<keyof _MapType>,
            ListenerMapType,
            MatchMapType,
        ];
    }, [queries]);

    // Set the initial value of our query state based on the listener values we derived
    const [queryState, setQueryState] = React.useState<MatchMapType>(initValue);

    /**
     * Whenever the media queries change, bind new events for all of the query
     * list objects. Make sure we're unbinding and rebinding on change to prevent
     * any duplicate or unnecessary handlers from existing.
     */
    React.useEffect(() => {
        // Create a single function that will check ALL media queries whenever any change
        const _updateOnChange = () => {
            const newValue: Partial<MatchMapType> = {};

            for (const key in mediaListeners) {
                const listener = mediaListeners[key];
                newValue[key] = listener.matches;
            }

            setQueryState(newValue as MatchMapType);
        };

        // Bind events for every configured query
        queryKeys.forEach((key) => {
            mediaListeners[key]?.addEventListener('change', _updateOnChange);
        });

        return () => {
            // Unbind events for every configured query
            queryKeys.forEach((key) => {
                mediaListeners[key]?.removeEventListener(
                    'change',
                    _updateOnChange,
                );
            });
        };
    }, [mediaListeners, queryKeys]);

    // If logging is configured, log the query state whenever it's updated
    React.useEffect(() => {
        if (log) console.log('useMediaQuery state', queryState);
    }, [log, queryState]);

    // Return the context provider with our match map query state object
    return (
        <MediaQueryContext.Provider value={queryState}>
            {children}
        </MediaQueryContext.Provider>
    );
}
