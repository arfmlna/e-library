import { useState, useEffect } from 'react';

export function useNetworkType() {
    const getConnectionInfo = () => {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!conn) {
            return { 
                supported: false, 
                type: 'Tidak didukung browser ini', 
                effectiveType: 'unknown' 
            };
        }
        
        return {
            supported: true,
            type: conn.type || 'unknown', // Nilai bisa: 'wifi', 'cellular', 'ethernet', dll.
            effectiveType: conn.effectiveType || 'unknown', // Nilai bisa: '4g', '3g', '2g'
            downlink: conn.downlink // Perkiraan kecepatan download dalam Mbps
        };
    };

    const [network, setNetwork] = useState(getConnectionInfo);

    useEffect(() => {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!conn) return;

        const handleConnectionChange = () => {
            setNetwork(getConnectionInfo());
        };

        conn.addEventListener('change', handleConnectionChange);

        return () => {
        conn.removeEventListener('change', handleConnectionChange);
        };
    }, []);

    return network;
}