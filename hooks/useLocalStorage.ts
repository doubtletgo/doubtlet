
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook that persists state to localStorage.
 * Handles hydration mismatch by waiting for client mount.
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // We use a ref to track if the component has mounted and loaded from localStorage
    // to prevent writing default values back to localStorage before reading.
    const isHydrated = useRef(false);

    // Initialize on mount to avoid hydration mismatch
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.log(error);
        } finally {
            isHydrated.current = true;
        }
    }, [key]);

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            setStoredValue((prevValue) => {
                const valueToStore = value instanceof Function ? value(prevValue) : value;

                // Save to local storage ONLY if we have already hydrated from it.
                // This prevents overwriting existing data with default initial state 
                // during the initial render/effect cycle.
                if (typeof window !== 'undefined' && isHydrated.current) {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }

                return valueToStore;
            });
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    }, [key]);

    return [storedValue, setValue];
}

export default useLocalStorage;
