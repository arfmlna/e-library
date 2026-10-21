import { pb } from "@/utils/pocketbase";

export const logs = async (userId, actionType, method) => {
    let ipAddress = 'Unknown';
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
            const data = await response.json();
            ipAddress = data.ip || 'Unknown';
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Gagal mengambil IP:', error);
        }
    }

    try {
        const res = await pb.collection('auth_logs').create({
            user: userId,
            action: actionType,
            method,
            ip_address: ipAddress,
            user_agent: navigator.userAgent
        });
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('error: ', error);
        }
    }
};