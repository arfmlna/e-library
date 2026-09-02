import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const readValue = () => {
        try {
            const saved = localStorage.getItem(key);
            return saved !== null ? JSON.parse(saved) : initialValue;
        } catch (error) {
            console.warn(`Error membaca localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [value, setValue] = useState(readValue);

    useEffect(() => {
        const handleStorage = () => {
            setValue(readValue());
        };
        
        window.addEventListener('storage', handleStorage);
        window.addEventListener('local-storage-update', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('local-storage-update', handleStorage);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    const setLiveValue = (newValue) => {
        try {
            const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
            
            localStorage.setItem(key, JSON.stringify(valueToStore));
            setValue(valueToStore);
            window.dispatchEvent(new Event('local-storage-update')); 
        } catch (error) {
            console.warn(`Error menyimpan localStorage key "${key}":`, error);
        }
    };

    return [value, setLiveValue];
}
