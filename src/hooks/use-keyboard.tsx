// hooks/useKeyboardShortcut.ts
import { useCallback, useEffect } from 'react';
import keyboardManager, { Handler } from '../lib/keyboard-manager';

export function useKeyboardShortcut(handler: Handler) {
    const stableHandler = useCallback(handler, [handler]);

    useEffect(() => {
        keyboardManager.subscribe(stableHandler);
        return () => {
            keyboardManager.unsubscribe(stableHandler);
        }
    }, [stableHandler]);
}